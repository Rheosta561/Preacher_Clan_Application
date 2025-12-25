import React from "react";
import { View, Text, Dimensions } from "react-native";
import { MotiView } from "moti";
import { Lightbulb } from "lucide-react-native";
import YoutubePlayer from "react-native-youtube-iframe";

interface InsightCardProps {
  title: string;
  insight: string;
  footer?: string;
  videoId: string;  
}

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  insight,
  footer,
  videoId,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const videoHeight = (screenWidth - 40) * 0.56; 

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 500, type: "timing" }}
      className="bg-zinc-950 border border-zinc-900 rounded-md max-w-[380px] overflow-hidden shadow-xl"
    >
      {/* YouTube Player */}
      <YoutubePlayer
        height={videoHeight}
        width={screenWidth - 40}
        videoId={videoId}
        play={true}
      />

      <View className="p-5 relative">
        {/* icon */}
        <View className="flex flex-row w-full items-start gap-2">
            <Lightbulb
          size={22}
          color="#fbbf24"
          className="absolute  opacity-80"
        />
         <Text className="text-2xl font-ScienceGothic text-white mb-2">
          {title}
        </Text>

        </View>
        

       

        <Text className="text-zinc-300 fonts text-base leading-5 mb-3">
          {insight}
        </Text>

        {footer && (
          <Text className="text-zinc-400 text-sm italic border-t border-zinc-700 pt-2">
            {footer}
          </Text>
        )}
      </View>
    </MotiView>
  );
};

export default InsightCard;
