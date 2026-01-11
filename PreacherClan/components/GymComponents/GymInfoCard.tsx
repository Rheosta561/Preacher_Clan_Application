import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Dumbbell, User, Wallet2, MapPin, Star } from "lucide-react-native";
import { useRouter } from "expo-router"; // expo-router navigation

type Gym = {
  name: string;
  image: string;
  location: string;
  distance?: string;
  trainers: number | string;
  equipments?: string[];
  fees?: number | string;
  rating?: number| undefined;
  featured?: boolean;
  gymId: string | number;
};

export default function GymInfoCard({ gym }: { gym: Gym }) {
  const {
    name,
    image,
    location,
    distance = "12km away",
    trainers,
    equipments = [],
    fees,
    rating,
    featured,
    gymId
  } = gym;

  const router = useRouter();

  const handleClick = () => {
    console.log("Navigating to gym with ID:", gymId);
  };

  return (
    <View className="bg-red-600 border mx-2 border-zinc-800 rounded-xl overflow-hidden shadow-lg w-[380px] max-w-md">
      
      {/* IMAGE + BADGES */}
      <View className="relative">
        <Image
          source={{ uri: image }}
          className="h-40 w-full"
          resizeMode="cover"
        />

        {/* Featured */}
        {featured && (
          <View className="absolute top-2 left-2 bg-yellow-500 px-2 py-1 rounded">
            <Text className="text-black text-xs font-ScienceGothic font-semibold">Featured</Text>
          </View>
        )}

        {/* Location badge */}
        <View className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded flex flex-row items-center gap-1">
          <MapPin size={14} color="#fb5656" />
          <Text className="text-white text-xs font-ScienceGothic">{location}</Text>
        </View>

        {/* Distance */}
        <View className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded">
          <Text className="text-white text-xs font-ScienceGothic">{distance}</Text>
        </View>
      </View>

      {/* DETAILS */}
      <View className="p-5">
        <Text className="text-lg font-bartle  text-black mb-4">{name}</Text>

        <View className="space-y- mb-5">

              
          <View className="flex mb-2 flex-row gap-3">
            <Dumbbell size={20} color="#000000" className="mt-1" />

            <View className="flex flex-row flex-wrap gap-2">
              {equipments.map((item, index) => (
                <View
                  key={index}
                  className="bg-zinc-950 px-2 py-1 rounded"
                >
                  <Text className="text-zinc-200 text-xs fonts">{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Fees */}
          <View className="flex flex-row mb-2 items-center gap-3">
            <Wallet2 size={20} color="#000000" />
            <Text className="text-zinc-950 font-ScienceGothic">
              Monthly Fee: <Text className="text-black font-medium">₹{fees}</Text>
            </Text>
          </View>

          {/* Rating */}
          <View className="flex flex-row items-center gap-4">
            <Star size={18} color="#000000" fill="#facc15" />
            <Text className="text-zinc-950 font-ScienceGothic ">
              Rating: <Text className="text-black font-medium">{rating} / 5</Text>
            </Text>
          </View>
        </View>

        {/* JOIN BUTTON */}
        <TouchableOpacity
          onPress={handleClick}
          className="w-full py-2 rounded-md bg-zinc-950 active:bg-zinc-900/80"
        >
          <Text className="text-center text-white  font-ScienceGothic text-sm">
            Join Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
