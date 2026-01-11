import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Image,
  RefreshControl
} from "react-native";
import { Search, Plus } from "lucide-react-native";
import ChatCard, { ChatCardProps } from "@/components/Chats/ChatCard";
import { useRouter } from "expo-router";
import { useUser } from "@/context/userContext";

export default function ChatScreen() {
  const user = useUser();
  const userId = user.user?.id;
  const router = useRouter();

  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

  const [chats, setChats] = useState<ChatCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);   // 👈 NEW
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);

  const [showFriendModal, setShowFriendModal] = useState(false);
  const [friendQuery, setFriendQuery] = useState("");
  const [friendResults, setFriendResults] = useState<any[]>([]);
  const [friendLoading, setFriendLoading] = useState(false);

  /* -------- FETCH CHATS -------- */
  const fetchChats = async () => {
    try {
      if (!refreshing) setLoading(true);   // avoid double loader

      const res = await fetch(`${backendUrl}/chat/getChats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: { _id: userId } })
      });

      const data = await res.json();
      // console.log('from backend ', data[0].participants);

      const mapped: ChatCardProps[] = data.map((chat: any) => {
        const other =
          chat.participants.find((p: any) => p._id !== userId) ??
          chat.participants[0];



        return {
          id: other?._id ?? "",
          username: other?.name || other?.username || "Unknown",
          latestMessage: chat.latestMessage?.content ?? "No messages yet",
          timestamp: new Date(chat.updatedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          }),
          profileImage: other?.profile?.profileImage?? "https://i.pravatar.cc/100",
          sender: chat.latestMessage?.sender?._id ?? "",
          currentUserId: userId ?? "",
          unreadCount: 0,
          participants: chat.participants
        };
      });
      // console.log(mapped);

      setChats(mapped);
    } catch (err) {
      console.log("CHAT FETCH ERROR:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);   // stop refresh 
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  /* pull to refresh */
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchChats();
  };

  /* search chat  */
  useEffect(() => {
    if (!search.trim()) return;

    const t = setTimeout(() => searchChats(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const searchChats = async (query: string) => {
    try {
      setSearching(true);

      const res = await fetch(
        `${backendUrl}/chat/search?q=${encodeURIComponent(query)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user: { _id: userId } })
        }
      );

      const data = await res.json();

      const mapped = data.map((chat: any) => {
        const other =
          chat.participants.find((p: any) => p._id !== userId) ??
          chat.participants[0];

        return {
          id: other?._id ?? "",
          username: chat.chatName || other?.username || other?.name || "Unknown",
          latestMessage: chat.latestMessage?.content ?? "No messages yet",
          timestamp: new Date(chat.updatedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          }),
          profileImage: chat.chatImage,
          sender: chat.latestMessage?.sender?._id ?? "",
          currentUserId: userId ?? "",
          unreadCount: 0,
          participants: chat.participants
        };
      });

      setChats(mapped);
    } finally {
      setSearching(false);
    }
  };

  /* open chat  */
  const openChat = (receiverId: string, chatName: string) => {
    router.push({
      pathname: "/(protected)/chats/ChatScreen",
      params: { id: receiverId, name: chatName }
    });
  };

  /* search the friends  */
  const searchFriends = async (q: string) => {
    setFriendQuery(q);

    if (!q.trim()) return setFriendResults([]);

    try {
      setFriendLoading(true);

      const res = await fetch(
        `${backendUrl}/search/partner?userId=${userId}&q=${encodeURIComponent(q)}`
      );

      const data = await res.json();
      setFriendResults(data);
    } finally {
      setFriendLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black">

{/* search */}
      <View className="flex-row items-center gap-2 m-4 px-3 py-2 bg-zinc-50 rounded-lg border border-zinc-900">
        <Search color="black" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search chats…"
          placeholderTextColor="#000"
          className="flex-1 text-zinc-950"
        />
      </View>

      {/* states */}
      {(loading && !refreshing) || searching ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : chats.length === 0 ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text className="text-white text-2xl font-ScienceGothic text-center">
            ⚔️ No scrolls found in the Clan Hall ⚔️
          </Text>
        </ScrollView>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {chats.map(chat => (
            <ChatCard key={chat.id} {...chat} onPress={openChat} />
          ))}
        </ScrollView>
      )}

{/* plus  */}
      <TouchableOpacity
        onPress={() => setShowFriendModal(true)}
        className="absolute bottom-10 right-10 bg-white h-20 w-20 rounded-full items-center justify-center"
      >
        <Plus size={30} color="black" />
      </TouchableOpacity>

{/* friend search  */}
      <Modal visible={showFriendModal} transparent animationType="slide">
        <View className="flex-1 bg-black/70 justify-end">
          <View className="bg-zinc-900 rounded-t-2xl p-5 h-[70%]">

            <Text className="text-white text-xl font-ScienceGothic mb-3">
              Invite a Warrior
            </Text>

            <View className="flex-row items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2">
              <Search color="white" />
              <TextInput
                value={friendQuery}
                onChangeText={searchFriends}
                placeholder="Search repmate…"
                placeholderTextColor="#aaa"
                className="flex-1 text-white font-ScienceGothic"
              />
            </View>

            {friendLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ScrollView className="mt-4">
                {friendResults.map(u => (
                  <TouchableOpacity
                    key={u.userId}
                    className="flex-row gap-3 py-2"
                    onPress={() => {
                      setShowFriendModal(false);
                      openChat(u.userId, u.name);
                    }}
                  >
                    <Image
                      source={{ uri: u.profileImage }}
                      className="h-12 w-12 rounded-full"
                    />
                    <Text className="text-white text-lg font-ScienceGothic">
                      {u.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <TouchableOpacity
              className="mt-4 bg-white py-2 rounded-lg"
              onPress={() => setShowFriendModal(false)}
            >
              <Text className="text-black text-center font-ScienceGothic">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}
