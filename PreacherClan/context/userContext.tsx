import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { IUser } from '@/constants/constants'

interface UserContextType {
  user: IUser | null
  loading: boolean
  saveUser: (user: IUser) => Promise<void>
  clearUser: () => Promise<void>
  logout: () => Promise<void>
}

const UserContext = createContext<UserContextType | null>(null)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem('user')
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch (err) {
      console.error('Error loading user', err)
    } finally {
      setLoading(false)
    }
  }

  const saveUser = async (userData: IUser) => {
    await AsyncStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const clearUser = async () => {
    await AsyncStorage.removeItem('user')
    setUser(null)
  }


  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user')
      await AsyncStorage.clear();

      setUser(null)
    } catch (err) {
      console.error('Logout failed', err)
    }
  }

  return (
    <UserContext.Provider
      value={{ user, loading, saveUser, clearUser, logout }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used inside UserProvider')
  return ctx
}
