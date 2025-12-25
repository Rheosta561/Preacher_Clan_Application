import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

interface SearchResultProps {
  name: string;
  image: string;
}

const SearchResult = ({ name, image }: SearchResultProps) => {
  return (
    <TouchableOpacity className="flex flex-row items-center p-3 bg-[] rounded-md mb-2">
      <Image 
        source={{ uri: image }}
        className="h-12 w-12 rounded-xl mr-3"
      />

      <Text className="text-white font-bartle text-lg ">{name}</Text>
    </TouchableOpacity>
  );
};

export default SearchResult;
