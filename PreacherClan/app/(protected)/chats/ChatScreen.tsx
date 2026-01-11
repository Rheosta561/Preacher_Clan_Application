import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import {
  Plus,
  Mic,
  Send,
  File as FileIcon,
  Image as ImageIcon,
  Video,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

import MessageCard from "@/components/Chats/MessageCard";
import { ChatMessage } from "@/constants/chats";

import { useLocalSearchParams } from "expo-router";
import { useUser } from "@/context/userContext";
import { useChat } from "@/context/ChatContext";
import { socketService } from "@/utils/socket";
import CustomToast from "@/components/CustomToast";

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

const MAX_RETRIES = 3;
const RETRY_DELAY = 1200;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const animateDot = (dot: Animated.Value, delay: number) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(dot, {
          toValue: 0.3,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  useEffect(() => {
    animateDot(dot1, 0);
    setTimeout(() => animateDot(dot2, 150), 150);
    setTimeout(() => animateDot(dot3, 300), 300);
  }, []);

  return (
    <View className="flex-row items-center ml-6 mt-1 mb-1">
      <Text className="text-zinc-800 mr-2 font-ScienceGothic">
        typing
      </Text>

      <Animated.Text
        style={{ opacity: dot1 }}
        className="text-zinc-500 text-lg font-bold"
      >
        •
      </Animated.Text>
      <Animated.Text
        style={{ opacity: dot2 }}
        className="text-zinc-500 text-lg font-bold"
      >
        •
      </Animated.Text>
      <Animated.Text
        style={{ opacity: dot3 }}
        className="text-zinc-500 text-lg font-bold"
      >
        •
      </Animated.Text>
    </View>
  );
};


type PendingMedia =
  | { type: "image"; uri: string; mime: string }
  | { type: "video"; uri: string; mime: string }
  | { type: "file"; uri: string; mime: string; name: string };

export default function ChatScreen() {
  const { id: receiverId } = useLocalSearchParams();
  const user = useUser();
  const userId = user.user?.id;

  const { setCurrentChatId } = useChat();

  const [toast, setToast] = useState({
    visible: false,
    title: "",
    message: "",
    type: "error" as "error" | "info" | "success",
  });

  const [chatId, setChatId] = useState<string | null>(null);
  // const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { messages, setMessages, } = useChat();

  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const [input, setInput] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [recording, setRecording] = useState(false);
  const [pendingMedia, setPendingMedia] = useState<PendingMedia | null>(null);

  const popupAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView | null>(null);
  const typingRef = useRef(false);
const lastTyped = useRef(Date.now());

const [remoteTyping, setRemoteTyping] = useState(false);

  const messagePositions = useRef<Record<string, number>>({});

  // NEW — for loading + refresh
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const showFailToast = () =>
    setToast({
      visible: true,
      type: "error",
      title: "⚔️ Message lost in battle",
      message: "Your raven could not deliver the message. Try again, warrior.",
    });

  // ---------- INIT CHAT ----------
  useEffect(() => {
  setMessages([]);   // reset when switching chats
}, [chatId]);
  useEffect(() => {
    if (!userId || !receiverId) return;

    const init = async () => {
      try {
        const res = await fetch(`${backendUrl}/chat/${userId}/${receiverId}`, {
          method: "POST",
        });
        const data = await res.json();
        setChatId(data._id);
      } catch (e) {
        console.log("INIT CHAT ERR", e);
      }
    };

    init();
  }, [userId, receiverId]);

  useEffect(() => {
    if (chatId) setCurrentChatId(chatId);
    return () => setCurrentChatId(null);
  }, [chatId]);

  // ---------- FETCH HISTORY ----------
  const fetchMessages = async () => {
    if (!chatId) return;

    try {
      const res = await fetch(`${backendUrl}/message/fetch/${chatId}`);
      const data = await res.json();

      const parsed: ChatMessage[] = data.map((m: any) => {
        const media = JSON.parse(m.media || "[]");

        const msg: ChatMessage = {
          id: m._id,
          text: m.content,
          sender: m.sender._id === userId ? "me" : "other",
          profileImage: m.sender.image ?? "",
          timestamp: m.createdAt,
          replyTo: m.replyTo?._id ?? null,
        };
        // console.log(msg);

        media.forEach((f: any) => {
          if (f.type === "image") msg.image = f.url;
          else if (f.type === "video") msg.video = f.url;
          else if (f.type === "audio") msg.audio = f.url;
          else msg.file = f.url;

          msg.fileName = f.fileName ?? f.url?.split("/")?.pop();
        });

        return msg;
      });

      setMessages(parsed);
    } catch (e) {
      console.log("FETCH ERROR", e);
    }
  };

  useEffect(() => {
    (async () => {
      if (!chatId) return;
      setLoadingMessages(true);
      await fetchMessages();
      setLoadingMessages(false);
    })();
  }, [chatId]);
  useEffect(() => {
  if (!loadingMessages && messages.length > 0) {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: false });
    }, 50);
  }
}, [loadingMessages]);

useEffect(() => {
  if (messages.length > 0) {
    scrollRef.current?.scrollToEnd({ animated: true });
  }
}, [messages.length]);



  // ---------- PULL TO REFRESH ----------
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMessages();
    setRefreshing(false);
  };
  useEffect(() => {
  if (!chatId || !userId) return;

  socketService.emit("joinChat", chatId);
}, [chatId, userId]);


  // useEffect(() => {
  //   socketService.on("newMessage", (msg: any) => {
  //     if (msg.chat.toString() !== chatId) return;

  //     if (messages.some((m) => m.id === msg._id)) return;

  //     const media = JSON.parse(msg.media || "[]");

  //     const formatted: ChatMessage = {
  //       id: msg._id,
  //       text: msg.content,
  //       sender: msg.sender._id === userId ? "me" : "other",
  //       timestamp: msg.createdAt,
  //       profileImage: msg.sender.image ?? "",
  //       replyTo: msg && msg.replyTo && msg.replyTo._id ? msg.replyTo._id : null

  //     };


  //     media.forEach((f: any) => {
  //       if (f.type === "image") formatted.image = f.url;
  //       else if (f.type === "video") formatted.video = f.url;
  //       else if (f.type === "audio") formatted.audio = f.url;
  //       else formatted.file = f.url;

  //       formatted.fileName = f.fileName ?? f.url?.split("/")?.pop();
  //     });

  //     setMessages((prev) => [...prev, formatted]);
  //   });

  //   socketService.on("messageDeleted", ({ messageId }: any) => {
  //     setMessages((prev) => prev.filter((m) => m.id !== messageId));
  //   });
  // }, [chatId, userId]);

  // ---------- RETRY ----------
  const retryingFetch = async (fn: () => Promise<any>) => {
    let attempt = 0;
    while (attempt < MAX_RETRIES) {
      try {
        return await fn();
      } catch {
        attempt++;
        await delay(RETRY_DELAY * attempt);
      }
    }
    throw new Error("Max retries exceeded");
  };

  // ---------- TEXT SEND ----------

  // plus animations
  const plusAnim = useRef(new Animated.Value(0)).current;

const rotate = plusAnim.interpolate({
  inputRange: [0, 1],
  outputRange: ["0deg", "45deg"],
});
const toggleOptions = () => {
  Animated.timing(plusAnim, {
    toValue: showOptions ? 0 : 1,
    duration: 200,
    useNativeDriver: true,
  }).start();

  setShowOptions(!showOptions);
};
type TypingEvent = {
  chatId: string;
  userId: string;
};

useEffect(() => {
  const onStart = ({ chatId: id, userId: from }: TypingEvent) => {
    if (id === chatId && from !== userId) setRemoteTyping(true);
  };

  const onStop = ({ chatId: id, userId: from }: TypingEvent) => {
    if (id === chatId && from !== userId) setRemoteTyping(false);
  };

  socketService.on("typing:start", onStart);
  socketService.on("typing:stop", onStop);

  return () => {
    socketService.off("typing:start", onStart);
    socketService.off("typing:stop", onStop);
  };
}, [chatId, userId]);



  const handleSend = async () => {
    if (!input.trim() || !chatId) return;

    const tempId = Date.now().toString();

    const optimistic: ChatMessage = {
      id: tempId,
      tempId,
      text: input,
      sender: "me",
      profileImage: "",
      timestamp: new Date(),
      replyTo: replyingTo?.id ?? null,
      status: "sending",
    };

    setMessages((prev) => [...prev, optimistic]);

    setInput("");
    setReplyingTo(null);
    typingRef.current = false;

socketService.emit("typing:stop", { chatId, userId });



    try {
      // console.log('replying to ' , replyingTo)
      const res = await retryingFetch(() =>
        fetch(`${backendUrl}/message/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            chatId,
            messageType: "text",
            content: input,
            replyTo: replyingTo?.id ?? null,
          }),
        })
      );

      const data = await res.json();
      // console.log(data);

      setMessages((prev) =>
        prev.map((m) =>
          m.tempId === tempId ? { ...m, id: data._id, status: "sent" } : m
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.tempId === tempId ? { ...m, status: "failed" } : m
        )
      );
      showFailToast();
    }
  };

  // ---------- OPTIMISTIC MEDIA ----------
  const confirmSendMedia = async () => {
    if (!pendingMedia || !chatId || !userId) return;

    const tempId = Date.now().toString();

    let messageType: "image" | "video" | "file" = "file";

    if (pendingMedia.type === "image") messageType = "image";
    if (pendingMedia.type === "video") messageType = "video";

    const optimistic: ChatMessage = {
      id: tempId,
      tempId,
      sender: "me",
      profileImage: "",
      timestamp: new Date(),
      replyTo: replyingTo?.id ?? null,
      status: "sending",
    };

    if (messageType === "image") optimistic.image = pendingMedia.uri;
    if (messageType === "video") optimistic.video = pendingMedia.uri;
    if (messageType === "file") optimistic.file = pendingMedia.uri;

    setMessages((prev) => [...prev, optimistic]);

    const form = new FormData();

    form.append("media", {
      uri: pendingMedia.uri,
      name:
        pendingMedia.type === "file"
          ? pendingMedia.name
          : `upload.${pendingMedia.mime.split("/")[1]}`,
      type: pendingMedia.mime,
    } as any);

    form.append("userId", userId);
    form.append("chatId", chatId);
    form.append("messageType", messageType);
    form.append("replyTo", replyingTo?.id ?? "");

    setPendingMedia(null);

    try {
      const res = await retryingFetch(() =>
        fetch(`${backendUrl}/message/send`, {
          method: "POST",
          body: form,
          headers: { "Content-Type": "multipart/form-data" },
        })
      );

      const data = await res.json();

      setMessages((prev) =>
        prev.map((m) =>
          m.tempId === tempId ? { ...m, id: data._id, status: "sent" } : m
        )
      );
    } catch (err) {
      console.log("MEDIA SEND FAILED", err);

      setMessages((prev) =>
        prev.map((m) =>
          m.tempId === tempId ? { ...m, status: "failed" } : m
        )
      );

      showFailToast();
    }
  };

  // ---------- PICKERS ----------
  const handlePickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!res.canceled)
      setPendingMedia({
        type: "image",
        uri: res.assets[0].uri,
        mime: res.assets[0].mimeType ?? "image/jpeg",
      });
  };

  const handleOpenCamera = async () => {
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!res.canceled)
      setPendingMedia({
        type: "image",
        uri: res.assets[0].uri,
        mime: res.assets[0].mimeType ?? "image/jpeg",
      });
  };

  const handlePickDocument = async () => {
    const res = await DocumentPicker.getDocumentAsync({});
    if (!res.canceled)
      setPendingMedia({
        type: "file",
        uri: res.assets[0].uri,
        name: res.assets[0].name,
        mime: res.assets[0].mimeType ?? "application/octet-stream",
      });
  };
const handleInputChange = (text: string) => {
  setInput(text);

  if (!chatId || !userId) return;

  const now = Date.now();

  if (!typingRef.current) {
    typingRef.current = true;
    socketService.emit("typing:start", { chatId, userId });
  }

  lastTyped.current = now;

  setTimeout(() => {
    if (Date.now() - lastTyped.current >= 1200) {
      typingRef.current = false;
      socketService.emit("typing:stop", { chatId, userId });
    }
  }, 1200);
};


console.log(remoteTyping)


  // ---------- DATE SEPARATORS ----------
  const isSameDay = (a: any, b: any) =>
    new Date(a).toDateString() === new Date(b).toDateString();

  const labelForDate = (d: any) => {
    const today = new Date();
    const date = new Date(d);

    if (isSameDay(today, date)) return "Today";

    const y = new Date();
    y.setDate(y.getDate() - 1);
    if (isSameDay(y, date)) return "Yesterday";

    return date.toLocaleDateString();
  };

  const grouped = messages.reduce((acc: any[], m) => {
    const key = new Date(m.timestamp).toDateString();
    let g = acc.find((x) => x.key === key);
    if (!g) {
      g = { key, label: labelForDate(m.timestamp), items: [] };
      acc.push(g);
    }
    g.items.push(m);
    return acc;
  }, []);

  // ---------- UI ----------
  return (
    <View className="flex-1 bg-zinc-50 pt-12">

      {/* Overlay for preview */}
      {pendingMedia && (
        <View className="absolute inset-0 bg-black/80 items-center justify-center px-4 z-50">
          <View className="bg-zinc-900 rounded-2xl p-4 w-full max-w-sm">

            <Text className="text-white text-lg mb-3 font-ScienceGothic">
              Send this Raven?
            </Text>

            <View className="rounded-xl overflow-hidden mb-4">
              {pendingMedia.type === "image" && (
                <Image
                  source={{ uri: pendingMedia.uri }}
                  className="w-full h-72"
                />
              )}

              {pendingMedia.type === "video" && (
                <View className="w-full h-72 bg-black items-center justify-center">
                  <Video />
                  <Text className="text-white mt-2">Video Selected</Text>
                </View>
              )}

              {pendingMedia.type === "file" && (
                <View className="w-full h-40 bg-black/30 items-center justify-center">
                  <FileIcon color="white" size={40} />
                  <Text className="text-white mt-2">
                    {pendingMedia.name}
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-row justify-between">

              <TouchableOpacity
                onPress={() => setPendingMedia(null)}
                className="px-4 py-2 bg-zinc-800 rounded-lg"
              >
                <Text className="text-white font-ScienceGothic">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmSendMedia}
                className="px-4 py-2 bg-indigo-600 rounded-lg"
              >
                <Text className="text-white font-ScienceGothic">
                  Send Raven 🕊
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      )}

      {/* Messages */}
      {loadingMessages ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4338ca" />
          <Text className="text-zinc-500 mt-2 font-ScienceGothic">
            Summoning ravens…
          </Text>
        </View>
      ) : (
        <ScrollView
          ref={scrollRef}
          className="flex-1 px-3 mt-2"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {grouped.map((g) => (
            <View key={g.key}>
              <Text className="text-center text-xs text-zinc-600 mt-4 mb-2 font-ScienceGothic">
                {g.label}
              </Text>

              {g.items.map((msg: ChatMessage) => (
                <View
    key={`${msg.tempId ?? msg.id}`}
    onLayout={e => {
      messagePositions.current[msg.id] = e.nativeEvent.layout.y;
    }}
  >
                  <MessageCard
                    message={msg}
                    repliedMessage={
                      msg.replyTo
                        ? messages.find((m) => m.id === msg.replyTo) ?? null
                        : null
                    }
                    onReply={setReplyingTo}
                    onScrollTo={(id) => {

    const pos = messagePositions.current[id];

    if (pos !== undefined) {
      setHighlightId(id);

      scrollRef.current?.scrollTo({
        y: pos - 100, 
        animated: true,
      });

      setTimeout(() => setHighlightId(null), 1200);
    }
  }}
                    highlight={highlightId === msg.id}
                  />
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      )}

      {/* Input Bar */}
      {/* Typing Indicator */}
{remoteTyping && <TypingIndicator />}

      {replyingTo && (
  <View className="mx-4 mb-2 px-3 py-2 bg-zinc-800 rounded-xl border border-zinc-700">
    <Text className="text-white text-xs">Replying to:</Text>
    <Text className="text-zinc-300" numberOfLines={2}>
      {replyingTo.text || "Media message"}
    </Text>

    <TouchableOpacity
      onPress={() => setReplyingTo(null)}
      style={{ position: "absolute", right: 10, top: 6 }}
    >
      <Text className="text-red-400 text-xs">Cancel</Text>
    </TouchableOpacity>
  </View>
)}

      <View className="flex-row items-center m-4 rounded-2xl px-3 py-3 bg-zinc-900 border border-zinc-800 relative">
        

        {showOptions && (
          <View className="absolute bottom-20 left-0 bg-black rounded-lg w-48 p-2">
            <TouchableOpacity
              onPress={handleOpenCamera}
              className="flex-row items-center gap-2 px-3 py-2 bg-white/90 rounded-lg mb-1"
            >
              <Video color="black" />
              <Text className="font-ScienceGothic">Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePickImage}
              className="flex-row items-center gap-2 px-3 py-2 bg-white/90 rounded-lg mb-1"
            >
              <ImageIcon color="black" />
              <Text className="font-ScienceGothic">Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePickDocument}
              className="flex-row items-center gap-2 px-3 py-2 bg-white/90 rounded-lg"
            >
              <FileIcon color="black" />
              <Text className="font-ScienceGothic">Document</Text>
            </TouchableOpacity>
          </View>
        )}

       <TouchableOpacity
  className="mr-2 bg-white rounded-full p-1"
  onPress={toggleOptions}
>
  <Animated.View style={{ transform: [{ rotate }] }}>
    <Plus color="black" />
  </Animated.View>
</TouchableOpacity>

        

        <TextInput
          value={input}
          onChangeText={handleInputChange}
          placeholder="Type a message…"
          placeholderTextColor="#aaa"
          className="flex-1 font-ScienceGothic bg-zinc-800 text-white px-4 py-2 rounded-xl"
        />

        {/* <TouchableOpacity className="ml-2 p-2">
          <Mic color="white" />
        </TouchableOpacity> */}

        <TouchableOpacity onPress={handleSend} className="ml-3">
          <Send color="white" />
        </TouchableOpacity>
      </View>

      <CustomToast
        visible={toast.visible}
        title={toast.title}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </View>
  );
}
