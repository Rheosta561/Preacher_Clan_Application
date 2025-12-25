import { View, TextInput, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import SearchResult from "./SearchResult";
import axios from "axios";

export interface SearchResultType {
  _id: string;
  name: string;
  image: string;
}

const SearchBox = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultType[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      handleSearch(query);
    }, 400); // debounce delay

    return () => clearTimeout(timeout);
  }, [query]);

//  api call 
  const handleSearch = async (searchQuery: string) => {
    try {
      setLoading(true);

      const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
      console.log(backendUrl)

      const response = await axios.get(
        `${backendUrl}/search`,
        {
          params: {
            q: searchQuery,
            type: "gyms"
          }
        }
      );

      setResults(response.data.gyms || []);
    } catch (error) {
      console.error(error);
      Alert.alert("Something went wrong while searching");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="p-2 w-full border border-zinc-900">

      {/* Search Input */}
      <TextInput
        placeholder="Search gyms..."
        placeholderTextColor="#aaa"
        value={query}
        onChangeText={setQuery}
        className="bg-zinc-950 font-ScienceGothic text-white px-4 py-3 rounded-md mb-2"
      />

      {/* Search Results */}
      <ScrollView
        className="max-h-40"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {results.map((item) => (
          <SearchResult
            key={item._id}
            name={item.name}
            image={item.image}
          />
        ))}

        {/* Optional empty state */}
        {!loading && query.length > 0 && results.length === 0 && (
          <SearchResult
            name="No gyms found"
            image=""
          />
        )}
      </ScrollView>

    </View>
  );
};

export default SearchBox;
