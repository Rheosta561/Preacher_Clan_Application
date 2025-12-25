import { View, Text, Image, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  MoreVertical,
  MessageCircle,
  Bell,
  UserX,
} from 'lucide-react-native'
import { Repmate_Profile } from '@/constants/constants'

// interface Props {
//   name: string
//   location: string
//   image: string
//   receiverId: string
// }

export default function RepMateCard({
  _id , 
  name,
  username , 
  profileImage,
}: Repmate_Profile) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <View className="relative bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      {/* Main row */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Image
            source={{ uri: profileImage }}
            className="h-14 w-14 rounded-full"
          />
          <View>
            <Text className="text-white font-semibold font-bartle text-sm">{name}</Text>
            <Text className="text-zinc-400 text-sm font-ScienceGothic">{username}</Text>
          </View>
        </View>

        {/* Three dots */}
        <TouchableOpacity onPress={() => setOpen(!open)}>
          <MoreVertical size={20} color="#a1a1aa" />
        </TouchableOpacity>
      </View>

      {/* Dropdown */}
      {open && (
        <View className="absolute right-3 top-14 w-48 bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden z-50">
          
          {/* Chat */}
          <TouchableOpacity
            onPress={() => {
              setOpen(false)
              // router.push(`/chat/${receiverId}`)
              console.log('Chat with', _id)
            }}
            className="flex-row items-center gap-3 px-4 py-3 border-b border-zinc-700"
          >
            <MessageCircle size={18} color="white" />
            <Text className="text-white text-sm font-ScienceGothic">Chat</Text>
          </TouchableOpacity>

          {/* Remind workout */}
          <TouchableOpacity
            onPress={() => {
              setOpen(false)
              console.log('Workout reminder sent')
            }}
            className="flex-row items-center gap-3 px-4 py-3 border-b border-zinc-700"
          >
            <Bell size={18} color="white" />
            <Text className="text-white text-sm font-ScienceGothic">Remind workout</Text>
          </TouchableOpacity>

          {/* Remove friend */}
          <TouchableOpacity
            onPress={() => {
              setOpen(false)
              console.log('Removed friend')
            }}
            className="flex-row items-center gap-3 px-4 py-3"
          >
            <UserX size={18} color="#f87171" />
            <Text className="text-red-400 text-sm font-ScienceGothic">
              Remove friend
            </Text>
          </TouchableOpacity>

        </View>
      )}
    </View>
  )
}
