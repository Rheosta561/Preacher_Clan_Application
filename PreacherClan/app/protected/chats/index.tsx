import ChatCard, { ChatCardProps } from "@/components/Chats/ChatCard";
import { useUser } from "@/context/userContext";
import { apiFetch } from "@/utils/Auth/apiFetch";
import { showToast } from "@/utils/showToast";
import { useRouter } from "expo-router";
import { Plus, Search } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Modal,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ChatScreen() {
  const { user, logout } = useUser();
  const userId = user?.id;

  const router = useRouter();

  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

  const [chats, setChats] = useState<ChatCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);

  const [showFriendModal, setShowFriendModal] = useState(false);
  const [friendQuery, setFriendQuery] = useState("");
  const [friendResults, setFriendResults] = useState<any[]>([]);
  const [friendLoading, setFriendLoading] = useState(false);

  // fetch chats
  const fetchChats = async () => {
    try {
      if (!refreshing) setLoading(true); // avoid double loader

      const data = await apiFetch<any[]>(
        "/chat/getChats",
        {
          method: "POST",
          body: { user: { _id: userId } },
        },
        logout,
      );

      // console.log('from backend ', data[0].participants);

      const mapped: ChatCardProps[] = data.map((chat: any) => {
        const other =
          chat.participants.find((p: any) => p._id !== userId) ??
          chat.participants[0];

        let latestMessageText = "No messages yet";

        if (chat.latestMessage) {
          if (chat.latestMessage.isDeleted) {
            latestMessageText = "Message deleted";
          } else if (chat.latestMessage.content?.trim()) {
            latestMessageText = chat.latestMessage.content;
          }
        }

        return {
          chatId: chat._id,
          id: other?._id ?? "",
          username: other?.name || other?.username || "Unknown",
          latestMessage: latestMessageText,
          timestamp: new Date(chat.updatedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          profileImage:
            other?.profile?.profileImage ?? "https://i.pravatar.cc/100",
          sender: chat.latestMessage?.sender?._id ?? "",
          currentUserId: userId ?? "",
          unreadCount: 0,
          participants: chat.participants,
        };
      });
      // console.log(mapped);

      setChats(mapped);
    } catch (err) {
      console.log("CHAT FETCH ERROR:", err);
    } finally {
      setLoading(false);
      setRefreshing(false); // stop refresh
    }
  };

  const handleDelete = async (chatId: string) => {
    try {
      const res = await apiFetch<any>(`/chat/delete/${chatId}`, {
        method: "DELETE",
        body: {
          userId,
        },
      });
      console.log(res);
      if (res.success == true) {
        setChats((prev) => prev.filter((chat) => chat.chatId != chatId));
        showToast({
          type: "info",
          title: "Chat deleted Successfully ",
        });
      }
    } catch (error) {
      console.error(error);
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

      const data = await apiFetch<any[]>(
        `/chat/search?q=${encodeURIComponent(query)}`,
        {
          method: "POST",
          body: { user: { _id: userId } },
        },
        logout,
      );

      const mapped = data.map((chat: any) => {
        const other =
          chat.participants.find((p: any) => p._id !== userId) ??
          chat.participants[0];

        return {
          id: other?._id ?? "",
          chatId: chat.id,
          username:
            chat.chatName || other?.username || other?.name || "Unknown",
          latestMessage: chat.latestMessage?.content ?? "No messages yet",
          timestamp: new Date(chat.updatedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          profileImage: chat.chatImage,
          sender: chat.latestMessage?.sender?._id ?? "",
          currentUserId: userId ?? "",
          unreadCount: 0,
          participants: chat.participants,
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
      pathname: "/protected/chats/ChatScreen",
      params: { id: receiverId, name: chatName },
    });
  };

  /* search the friends  */
  const searchFriends = async (q: string) => {
    setFriendQuery(q);

    if (!q.trim()) return setFriendResults([]);

    try {
      setFriendLoading(true);

      const data = await apiFetch<any[]>(
        `/search/partner?userId=${userId}&q=${encodeURIComponent(q)}`,
        {},
        logout,
      );

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
          className="flex-1 font-ScienceGothic text-zinc-950"
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
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
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
          {chats.map((chat) => (
            <ChatCard
              key={chat.id}
              {...chat}
              onPress={openChat}
              onDelete={() => {
                handleDelete(chat.chatId);
              }}
            />
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
                {friendResults.map((u) => (
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
