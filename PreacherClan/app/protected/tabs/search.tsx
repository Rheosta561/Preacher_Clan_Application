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
import { useUser } from "@/context/userContext";
import { apiFetch } from "@/utils/Auth/apiFetch";

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

  const mapBackendGymToUI = (gym: any) => {
  return {
    gymId: gym._id,
    name: gym.name,
    image:
      gym.profileImage ||
      gym.image ||
      "https://res.cloudinary.com/dzjuyflzw/image/upload/v1/default_gym.jpg",
    location: gym.location || gym.address?.city || "India",
    rating: gym.rating ?? 0,
    featured: gym.featured ?? false,
    equipments: gym.equipment ?? [],
    fees: gym.membership?.[0] ?? "—",
  };
};


export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<SearchItem | null>(null);
  const [loading, setLoading] = useState(false);
  const {logout} = useUser();
  const showResults = query.trim().length > 0;



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

    const data = await apiFetch<{
      users?: any[];
      gyms?: any[];
    }>(
      `/search?q=${encodeURIComponent(searchQuery)}&type=all`,
      {},
      logout 
    );
    console.log('users from backedn ' , data.users);

    const users =
      data.users?.map((u: any) => ({
        ...u,
        type: "user",
        image: u.profile?.profileImage,
      })) || [];



    const gyms =
  data.gyms?.map((g: any) => ({
    ...mapBackendGymToUI(g),
    type: "gym",
  })) || [];

      // console.log('gyms , ' , gyms);

    setResults([...gyms, ...users]);
  } catch (error: any) {
    if (error.message === "SESSION_EXPIRED") {
      // logout already handled
      return;
    }

    console.error("Search error:", error);
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
