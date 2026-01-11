import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import React from 'react';

interface ChallengeCardProps {
  title: string;
  description: string;
  buttonText?: string;
  image: ImageSourcePropType;  // <-- asset image support
  onPress?: () => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  title,
  description,
  buttonText = "Join Now",
  image,
  onPress,
}) => 
  
  
  {
    const truncateWords = (text: string, limit = 10) => {
  if (!text) return "";
  const words = text.split(" ");
  return words.length > limit
    ? words.slice(0, limit).join(" ") + "..."
    : text;
};

  return (
    <View className="h-44 rounded-lg bg-red-600 flex flex-row p-3 items-center">
      
      {/* Local Image */}
      <Image
        source={image}
        className="h-28 w-28 rounded-full"
        resizeMode="cover"
      />

      <View className="flex-1 ml-4 justify-between py-2">
        <Text className="text-black text-xl font-ScienceGothic ">
          {title}
        </Text>

        <Text className="text-zinc-950 text-xs font-medium font-ScienceGothic">
  {truncateWords(description, 20)}
</Text>


        <TouchableOpacity
          onPress={onPress}
          className="h-8 w-full mt-2 bg-black rounded-md items-center justify-center"
        >
          <Text className="text-zinc-100 font-ScienceGothic ">{buttonText}</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default ChallengeCard;
