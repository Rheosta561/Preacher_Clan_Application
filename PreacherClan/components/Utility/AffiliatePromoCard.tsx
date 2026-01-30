import React, { useState } from "react";
import { View, Text, Dimensions, Image, TouchableOpacity } from "react-native";
import { MotiView } from "moti";
import YoutubePlayer from "react-native-youtube-iframe";
import { LinearGradient } from "expo-linear-gradient";
import { ShoppingBag } from "lucide-react-native";

const { width } = Dimensions.get("window");
const HEIGHT = 320;

interface AffiliatePromoCardProps {
  title: string;
  brand?: string;
  tags?: string[];
  youtubeVideoId?: string;
  imageUrl?: string;
  ctaText?: string;
  onPress: () => void;
}

export default function AffiliatePromoCard({
  title,
  brand,
  tags = [],
  youtubeVideoId,
  imageUrl,
  ctaText = "View Deal",
  onPress,
}: AffiliatePromoCardProps) {
  const [playing] = useState(true);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 400 }}
      className="rounded-2xl overflow-hidden border border-zinc-800 bg-black"
      style={{ width: width - 32, height: HEIGHT }}
    >
      {/* ===== BACKGROUND MEDIA ===== */}

      {youtubeVideoId ? (
        <YoutubePlayer
          height={HEIGHT}
          width={width}
          videoId={youtubeVideoId}
          play={playing}
          mute
          webViewStyle={{ opacity: 0.95 }}
          initialPlayerParams={{
            controls: false,
            modestbranding: true,
            playsinline: true,
            rel: false,
          }}
        />
      ) : imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          resizeMode="cover"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
        />
      ) : null}

      {/* ===== OVERLAY ===== */}
      <LinearGradient
        colors={["rgba(0,0,0,0.15)", "rgba(0,0,0,0.85)"]}
        className="absolute inset-0"
      />

      {/* ===== CONTENT ===== */}
      <View className="absolute inset-0 p-5 justify-between">
        {/* TAGS */}
        <View className="flex-row flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <Tag key={idx} text={tag} />
          ))}
        </View>

        {/* TITLE */}
        <View>
          {brand && (
            <Text className="text-zinc-400 text-xs font-ScienceGothic mb-1">
              {brand}
            </Text>
          )}
          <Text className="text-white text-xl font-bartle">
            {title}
          </Text>
        </View>

        {/* CTA */}
        <TouchableOpacity
          onPress={onPress}
          className="flex-row items-center justify-center gap-2 bg-white py-3 rounded-md"
        >
          <ShoppingBag size={18} color="black" />
          <Text className="text-black font-ScienceGothic text-sm">
            {ctaText}
          </Text>
        </TouchableOpacity>
      </View>
    </MotiView>
  );
}

/* ================= SUB COMPONENT ================= */

const Tag = ({ text }: { text: string }) => (
  <View className="bg-zinc-900/90 px-3 py-1 rounded-lg">
    <Text className="text-white text-xs font-ScienceGothic">
      {text}
    </Text>
  </View>
); 
