import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Animated,
  PanResponder,
} from "react-native";
import { Video } from "expo-av";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Paperclip } from "lucide-react-native";

export type SenderType = "me" | "other";

export interface ChatMessage {
  id: string;
  text?: string;
  image?: string;
  video?: string;
  audio?: string;
  file?: string;
  fileName?: string;
  sender: SenderType;
  profileImage: string;
  timestamp: Date | string;
  replyTo?: string | null;
  reaction?: string;
  isDeleted? : boolean ; 
}

export interface MessageCardProps {
  message: ChatMessage;
  repliedMessage?: ChatMessage | null;

  onReply?: (message: ChatMessage) => void;
  onDelete?: (message: ChatMessage) => void;
  onReact?: (message: ChatMessage, emoji: string | null) => void;
  onScrollTo?: (id: string) => void;

  highlight?: boolean;
}

export default function MessageCard({
  message,
  repliedMessage,
  onReply,
  onDelete,
  onReact,
  onScrollTo,
  highlight = false,
}: MessageCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const isMe = message.sender === "me";
//   console.log('message', message);

  const emojis = ["👍", "🔥", "😂", "❤️", "😮", "🙏"];

  const getSnippet = (txt?: string) =>
    txt ? txt.split(" ").slice(0, 3).join(" ") + "…" : "Media…";

  const formatTime = (ts: Date | string) =>
    new Date(ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  // highlight glow
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!highlight) return;
    glow.setValue(0);
    Animated.sequence([
      Animated.timing(glow, { toValue: 1, duration: 250, useNativeDriver: false }),
      Animated.timing(glow, { toValue: 0, duration: 800, useNativeDriver: false }),
    ]).start();
  }, [highlight]);

  const animatedBg = {
    backgroundColor: glow.interpolate({
      inputRange: [0, 1],
      outputRange: [isMe ? "#4338ca" : "#27272a", "#6d28d9"],
    }),
  };

  // ===== SWIPE TO REPLY =====
  const translateX = useRef(new Animated.Value(0)).current;
  const SWIPE_TRIGGER = 40;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dx > 10 && Math.abs(g.dy) < 10,
      onPanResponderMove: (_, g) => {
        if (g.dx > 0) translateX.setValue(Math.min(g.dx, 60));
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx > SWIPE_TRIGGER) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onReply?.(message);
        }

        Animated.spring(translateX, {
  toValue: 0,
  useNativeDriver: false,
}).start();

      },
    })
  ).current;
  if (message.isDeleted) {
    return (
      <View className="my-2 px-2 w-full">
        <View
          className={`flex flex-row ${
            isMe ? "justify-end" : "justify-start"
          }`}
        >
          <View
            className={`px-3 py-2 rounded-lg max-w-[75%] ${
              isMe ? "bg-zinc-300" : "bg-zinc-800"
            }`}
          >
            <Text className=" text-zinc-500 text-sm font-ScienceGothic italic font-semibold">
              This message was deleted
            </Text>
          </View>
        </View>
      </View>
    );
  }


  return (
    <View className="my-2 px-2 w-full ">
      <View
        className={`flex flex-row items-end ${
          isMe ? "justify-end" : "justify-start"
        }`}
      >
        {/* {!isMe && (
          <Image
            source={{ uri: message.profileImage }}
            className="w-8 h-8 rounded-full mr-2"
          />
        )} */}

        {/* SWIPE CONTAINER */}
        <Animated.View
          style={[
            animatedBg,
            {
              transform: [{ translateX }],
            },
          ]}
          className="rounded-2xl max-w-[75%]"
          {...panResponder.panHandlers}
        >
          <Pressable
            delayLongPress={220}
            onLongPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setShowMenu(true);
            }}
            className={`w-full rounded-2xl px-3 py-2 ${
              isMe ? "bg-red-600" : "bg-zinc-950"
            }`}
          >
            {/* Reply Preview */}
            {repliedMessage && (
              <TouchableOpacity
                onPress={() => onScrollTo?.(repliedMessage.id)}
                className="border-l-2 border-zinc-400 pl-2 mb-1"
              >
                <Text className={`text-xs font-ScienceGothic ${isMe ? "text-black " : "text-white"}`}>
                  Replying to: {getSnippet(repliedMessage.text)}
                </Text>
              </TouchableOpacity>
            )}

            {/* TEXT */}
            {message.text && <Text
  className={`font-ScienceGothic ${
    isMe ? "text-black" : "text-white"
  }`}
  style={{ flexShrink: 1 }}
>{message.text}</Text>}

            {/* IMAGE */}
            {message.image && (
              <Image
                source={{ uri: message.image }}
                className="w-52 h-52 rounded-xl mt-2"
              />
            )}

            {/* VIDEO */}
            {message.video && (
              <Video
                source={{ uri: message.video }}
                useNativeControls
                className="w-56 h-40 rounded-xl mt-2"
              />
            )}

            {/* FILE */}
            {message.file && (
              <View className="flex-row items-center gap-2 mt-2">
                <Paperclip color="white" />
                <Text className="text-white font-ScienceGothic underline">
                  {message.fileName ?? "Attachment"}
                </Text>
              </View>
            )}

            {/* TIMESTAMP */}
            <Text
              className={`text-[10px] font-ScienceGothic  ${
                isMe ? "text-right text-zinc-900 " : "text-left text-zinc-50"
              }`}
            >
              {formatTime(message.timestamp)}
            </Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* REACTION CHIP */}
      {message.reaction && (
        <View
          className={`mt-1 px-2 py-[2px] rounded-full bg-zinc-800 self-${
            isMe ? "end" : "start"
          }`}
        >
          <Text className="text-black text-sm">{message.reaction}</Text>
        </View>
      )}

      {/* MENU */}
      {showMenu && (
        <BlurView
          intensity={30}
          tint="dark"
          className="absolute inset-0 z-50 justify-center items-center"
        >
          <View className="bg-gray-100 absolute z-50 rounded-3xl p-4 w-72  border border-zinc-900 items-stretch">

            <View className="flex-row justify-center gap-3 mb-4">
              {emojis.map((e) => {
                const active = message.reaction === e;
                return (
                  <TouchableOpacity
                    key={e}
                    onPress={() => {
                      onReact?.(message, active ? null : e);
                      setShowMenu(false);
                    }}
                  >
                    <Text
                      className={`text-2xl ${
                        active ? "bg-white scale-110  p-2 rounded-full " : ""
                      }`}
                    >
                      {e}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              onPress={() => {
                onReply?.(message);
                setShowMenu(false);
              }}
              className="py-2"
            >
              <Text className="text-black font-ScienceGothic  text-center text-lg">Reply</Text>
            </TouchableOpacity>

           {isMe && (
  <TouchableOpacity
    onPress={() => {
      onDelete?.(message);
      setShowMenu(false);
    }}
    className="py-2"
  >
    <Text className="text-red-600 font-ScienceGothic text-center text-lg">
      Delete
    </Text>
  </TouchableOpacity>
)}

            <TouchableOpacity
              onPress={() => setShowMenu(false)}
              className="py-2"
            >
              <Text className="text-zinc-black font-ScienceGothic text-center text-lg">Cancel</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      )}
    </View>
  );
}
