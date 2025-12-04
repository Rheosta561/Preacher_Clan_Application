import { Button, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native';
import { Bell, BellDotIcon, BellElectricIcon, BellMinusIcon, BellRingIcon, ConciergeBellIcon, MessageCircle, MessageCircleHeart, MessageSquare } from 'lucide-react-native';

export default function Navbar() {
  return (
    <View className="absolute z-50 h-40   w-full">
      <View className="absolute  h-36 w-full bg-gradient-to-b bg-[#000000b0] border " />
      {/* <View className="absolute bottom-0 h-28 w-full bg-[#00000036]" /> */}

      <View className='absolute bottom-12 w-full left-5 flex flex-row justify-between  '>
        <View className='flex flex-row items-end gap-3 w-1/2   h-full '>
        <View className='h-10 w-10 rounded-full bg-white '>

        </View>
         <View>
          <Text className='text-white text-lg font-semibold' >Hi Anubhav</Text>
        <Text className='text-zinc-200 text-xs ' >Preacher Score | 0</Text>

        </View>
       
        
          
        </View>

        <View className="flex flex-row h-full mr-8 items-center gap-4 px-3">

      {/* Chat Button */}
      <TouchableOpacity className="p-2 rounded-full ">
        <MessageSquare size={24} color="white" strokeWidth={2} />
      </TouchableOpacity>

      {/* Notification Button */}
      <TouchableOpacity className="p-2 rounded-full">
        <Bell size={24} color="white" strokeWidth={2} />
      </TouchableOpacity>

    </View>
        
      </View>


     
      


    </View>
  );
}
