import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Home, Search, Users, User2 , DumbbellIcon , PlusSquareIcon } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { ProtectedScreen } from '@/components/Protected/ProtectedRoute';
import { useUser } from "@/context/userContext";
import { showToast } from "@/utils/showToast";



export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = '#FFFFFF';
  const inactiveColor = "#8e8e93";
  const { user } = useUser();

  const hasGym = Boolean(user?.gym?.id);

 

  return (

    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: "#000000",
          borderTopWidth: 1,
          borderColor: "#2B2B2B",
          borderWidth: 0.6,
          marginBottom: 14,
          marginHorizontal: 10,
          borderRadius: 12,
          height: 80,
          overflow: "hidden",
          position: "absolute",
          paddingTop:15,
          alignItems: "center",
          justifyContent: "center",

            
        },
         tabBarLabelStyle: {
          fontFamily: 'ScienceGothic', 
          fontSize: 11,

        },
      }}
    >

      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Home
              size={23}
              color={focused ? activeColor : inactiveColor}
              strokeWidth={focused ? 2.2 : 1.7}
            />
          ),
          headerTitleStyle: {
            fontFamily: 'BBH-Bartle', 
            fontSize: 16,
            color: '#ffffff',
          },

        }}
        
      />

      {/* Search */}
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => (
            <Search
              size={23}
              color={focused ? activeColor : inactiveColor}
              strokeWidth={focused ? 2.2 : 1.7}
            />
          ),
        }}
      />

      {/* Clan */}
  <Tabs.Screen
  name="clan"
  options={{
    title: "Clan",
    tabBarIcon: ({ focused }) => (
      <DumbbellIcon
        size={23}
        color={
          hasGym
            ? focused
              ? activeColor
              : inactiveColor
            : "#4b4b4b"
        }
        strokeWidth={focused ? 2.2 : 1.7}
      />
    ),
  }}
  listeners={{
    tabPress: (e) => {
      if (!hasGym) {
        e.preventDefault(); //  stop navigation
        showToast({
          type: "info",
          title: "Clan Locked",
          message: "Join a gym to unlock Clan features",
        });
      }
    },
  }}
/>



      {/* Buddy */}
      <Tabs.Screen
        name="buddy"
        options={{
          title: 'Buddy',
          tabBarIcon: ({ focused }) => (
            <PlusSquareIcon
              size={23}
              color={focused ? activeColor : inactiveColor}
              strokeWidth={focused ? 2.2 : 1.7}
            />
          ),
        }}
      />

    </Tabs>
  );
}
