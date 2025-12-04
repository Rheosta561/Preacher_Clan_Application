import { View, TextInput, ScrollView } from "react-native";
import React, { useState } from "react";
import SearchResult from "./SearchResult";

const SearchBox = () => {
  const [query, setQuery] = useState("");

  const sampleData = [
    {
      id: 1,
      name: "Iron Gym",
      image: "https://i.imgur.com/eY5P7qU.jpeg",
    },
    {
      id: 2,
      name: "Paneer Tikka",
      image: "https://i.imgur.com/W3pE6oH.jpeg",
    },
    {
      id: 3,
      name: "Veg Burger",
      image: "https://i.imgur.com/xUoEJNj.jpeg",
    },
  ];

  const filtered = sampleData.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View className="p-2 w-full border border-zinc-900">

      {/* Search Input */}
      <TextInput
        placeholder="Search..."
        placeholderTextColor="#aaa"
        value={query}
        onChangeText={setQuery}
        className="bg-zinc-950 text-white px-4 py-3 rounded-md mb-2"
      />

      {/* Search Results */}
      <ScrollView className="max-h-32" showsVerticalScrollIndicator={false}>
        {filtered.map(item => (
          <SearchResult 
            key={item.id}
            name={item.name}
            image={item.image}
          />
        ))}
      </ScrollView>

    </View>
  );
};

export default SearchBox;
