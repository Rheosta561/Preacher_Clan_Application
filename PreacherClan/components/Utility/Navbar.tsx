import { Button, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native';
import { Bell, BellDotIcon, BellElectricIcon, BellMinusIcon, BellRingIcon, ConciergeBellIcon, MessageCircle, MessageCircleHeart, MessageSquare } from 'lucide-react-native';
import { useUser } from '@/context/userContext';
import { useRouter } from 'expo-router';
import { useState  , useEffect} from 'react';
import { IUserWithProfile } from '@/constants/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotification } from "@/context/NotificationContext";

import { Image } from 'react-native';

export default function Navbar() {
  const { user } = useUser();
  const router = useRouter();
  const { unreadCount } = useNotification();
  // console.log("User in Navbar:", user);
  const [profile , setProfile] = useState<IUserWithProfile>();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      try {
        const cachedProfile = await AsyncStorage.getItem('profile');
        if (cachedProfile) {
          setProfile(JSON.parse(cachedProfile));
          return;
        }

        const res = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/profile/${user.id}`
        );

        if (res.status === 404) {
          return;
        }

        const data = await res.json();
        setProfile(data.profile);
      } catch (error) {
        console.error('Error fetching profile in Navbar:', error);
      }
    };

    fetchProfile();
    
  }, [])
  

  const handleProfilePress = () => {
    router.push('/(protected)/profile');
  };

  const handleChatPress = ()=>{
    router.push('/(protected)/chats');
  }

  const handleNotificationPress = ()=>{
    router.push('/(protected)/notification');
  }

  return (
    <View className="absolute z-50 h-40   w-full">
      <View className="absolute  h-36 w-full bg-gradient-to-b bg-[#000000f6] border border-zinc-800 " />
      {/* <View className="absolute bottom-0 h-28 w-full bg-[#00000036]" /> */}

      <View className='absolute bottom-12 w-full left-5 flex flex-row justify-between  '>
       
        <View className='flex flex-row items-end gap-3 w-1/2   h-full '>
         <TouchableOpacity onPress={handleProfilePress} className=' flex flex-row items-center gap-3    h-full '>
         <View className='h-10 w-10 rounded-full bg-white '>
          <Image source={{ uri: profile?.profileImage || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }} className='h-10 w-10 rounded-full ' />
          

        </View>
         <View className='w-full'>
          <Text className='text-white text-lg font-ScienceGothic' >Hi {user?.name || 'User'}</Text>
        <Text className='text-zinc-200 text-xs font-ScienceGothic ' >Preacher Score | {user?.preacherScore}</Text>

        </View>
        </TouchableOpacity>
        
       
        
          
        </View>

        <View className="flex flex-row h-full mr-8 items-center gap-4 px-3">

      {/* Chat Button */}
      <TouchableOpacity className="p-2 rounded-full " onPress={handleChatPress}>
        <MessageSquare size={24} color="white" strokeWidth={2} />
      </TouchableOpacity>

      {/* Notification Button */}
   <TouchableOpacity
  className="p-2 rounded-full relative"
  onPress={handleNotificationPress}
>
  <Bell size={24} color="white" strokeWidth={2} />

  {unreadCount > 0 && (
    <View
      className="
        absolute 
        -top-1 
        -right-1 
        bg-zinc-100 
        min-w-[18px] 
        h-[18px] rounded-full
        items-center 
        justify-center 
        px-1
      "
    >
      <Text className="text-black text-[10px] font-bold">
        {unreadCount > 9 ? "9+" : unreadCount}
      </Text>
    </View>
  )}
</TouchableOpacity>


    </View>
        
      </View>


     
      


    </View>
  );
}
