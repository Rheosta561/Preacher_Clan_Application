import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert
} from "react-native";
import { Search, X } from "lucide-react-native";
import { MotiView } from "moti";
import axios from "axios";

import ProfileCard from "@/components/ProfileCard";
import GymInfoCard from "@/components/GymComponents/GymInfoCard";
import { mapUserToProfileCard } from "@/utils/mapUsertoProfile";

export interface UserSearchItem {
  userId: string;
  name: string;
  goals: string[];
  preferredTime: string;
  preacherScore : number ; 
  image : string ; 
  type : "user"
}

// types
type SearchItem =
  | ({ type: "user" } & any)
  | ({ type: "gym" } & any);


export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<SearchItem | null>(null);
  const [loading, setLoading] = useState(false);

  const showResults = query.trim().length > 0;
  const mapUserToUI = (user: any): UserSearchItem => {
  return {
    userId: user._id,
    name: user.name,
    goals: user.profile?.fitnessGoals ?? [],
    preferredTime:
      user.profile?.exerciseGenre?.[0] ??
      "Flexible",
    preacherScore : user.preacherScore ,
    image : user.profile?.profileImage ,
    type: "user"
    
  };
};


// delayed search
  useEffect(() => {
    if (!showResults) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetchSearchResults(query);
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

// backedn call
  const fetchSearchResults = async (searchQuery: string) => {
    try {
      setLoading(true);
      const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

      const response = await axios.get(`${backendUrl}/search`, {
        params: {
          q: searchQuery,
          type: "all"
        }
      });

      // console.log(response.data.users)

      const users =
        response.data.users?.map((u: any) => ({
          ...u,
          type: "user",
          image : u.profile?.profileImage 
        })) || [];

        // console.log('users from backend \n\n\n' , users);


        const uiUsers: UserSearchItem[] = users.map(mapUserToUI);

      const gyms =
        response.data.gyms?.map((g: any) => ({
          ...g,
          type: "gym"
        })) || [];

      setResults([...gyms, ...users]);

      // console.log(results);
    } catch (error) {
      console.error(error);
      Alert.alert("Search failed", "Please try again");
    } finally {
      setLoading(false);
    }
  };

  // console.log('results \n' , results)

  return (
    <View className="flex-1 bg-zinc-950 pt-16 px-4">
      
      {/* Search Bar */}
      <View className="w-full mb-4">
        <View className="relative flex flex-row px-4  items-center bg-zinc-900 gap-2 p-2 rounded-lg">
          <Search size={20} color="white"  />
          <TextInput
            placeholder="Search gyms or users..."
            placeholderTextColor="#71717a"
            value={query}
            onChangeText={setQuery}
            className="w-full  text-white font-ScienceGothic  py-3 rounded-md text-sm"
          />
        </View>
      </View>

      {/* Result List */}
      {showResults && (
        <ScrollView className="mt-4">
          {results.length > 0 ? (
            results.map((item, idx) => (
              <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                key={item._id || idx}
                className="flex-row items-center gap-3 bg-zinc-900 border-dashed border border-zinc-800 p-3 rounded-lg mb-3"
              >
                <TouchableOpacity
                  onPress={() => setSelectedItem(item)}
                  className="flex-row items-center"
                >
                  <Image
                    source={{ uri: item.image || item.profile?.image }}
                    className={
                      item.type === "user"
                        ? "w-16 h-16 rounded-full"
                        : "w-16 h-16 rounded-md"
                    }
                  />

                  <View className="ml-3">
                    <Text className="text-white font-semibold font-ScienceGothic">
                      {item.name}
                    </Text>
                    <Text className="text-zinc-400 text-sm font-ScienceGothic">
                      {item.type === "gym"
                        ? item.location
                        : `${item.preacherScore ?? "—"} Score`}
                    </Text>
                  </View>
                </TouchableOpacity>
              </MotiView>
            ))
          ) : (
            !loading && (
              <Text className="text-zinc-500 mt-4">No results found.</Text>
            )
          )}
        </ScrollView>
      )}

      {/* Modal */}
      <Modal visible={!!selectedItem} transparent animationType="fade">
        <View className="flex-1 bg-black/60 items-center justify-center">
          <View className="relative">

            {selectedItem?.type === "user" ? (
              <ProfileCard profile={mapUserToProfileCard(selectedItem)} />
            ) : (
              <GymInfoCard gym={selectedItem as any} />
            )}

            {/* Close Button */}
            <TouchableOpacity
              className="absolute -top-4 -right-4 bg-zinc-800 p-2 rounded-full"
              onPress={() => setSelectedItem(null)}
            >
              <X size={20} color="white" />
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </View>
  );
}
