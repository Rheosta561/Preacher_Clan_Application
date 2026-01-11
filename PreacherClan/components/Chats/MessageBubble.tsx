import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { MoreVertical } from "lucide-react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";

interface Props {
  msg: any;
  isMe: boolean;
  repliedText?: string;
  onReply: () => void;
  onDelete: () => void;
  highlighted?: boolean;
}

export default function MessageBubble({
  msg,
  isMe,
  repliedText,
  onReply,
  onDelete,
  highlighted,
}: Props) {

  const [menu, setMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <>
      <Swipeable
        onSwipeableOpen={onReply}
        renderLeftActions={() => (
          <View className="w-10 bg-green-600 justify-center rounded-lg ml-2">
            <Text className="text-white text-center text-xs">Reply</Text>
          </View>
        )}
      >
        <View className={`flex-row gap-2 my-2 ${isMe ? "justify-end" : ""}`}>
          {!isMe && (
            <Image
              source={{ uri: msg.profileImage }}
              className="w-8 h-8 rounded-full"
            />
          )}

          <View
            className={`max-w-[80%] px-3 py-2 rounded-2xl shadow 
              ${isMe ? "bg-indigo-700 rounded-tr-none" : "bg-zinc-800 rounded-tl-none"}
              ${highlighted ? "border border-amber-400" : ""}
            `}
          >
            {repliedText && (
              <View className="bg-zinc-900/40 border-l-2 border-zinc-400 px-2 py-1 rounded mb-1">
                <Text className="text-[11px] text-zinc-300 italic">
                  {repliedText}
                </Text>
              </View>
            )}

            {msg.text && (
              <Text className="text-white text-[15px]">{msg.text}</Text>
            )}

            {msg.audio && (
              <Text className="text-blue-400 mt-2">🎤 Voice message</Text>
            )}

            <View className="flex-row justify-between mt-1">
              <Text className="text-[10px] text-zinc-300">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>

              <TouchableOpacity onPress={() => setMenu(!menu)}>
                <MoreVertical size={16} color="white" />
              </TouchableOpacity>
            </View>

            {menu && (
              <View className="absolute right-0 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 mt-6 z-50">
                <TouchableOpacity
                  onPress={() => {
                    setMenu(false);
                    onReply();
                  }}
                >
                  <Text className="text-white mb-2">Reply</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setMenu(false);
                    setConfirmDelete(true);
                  }}
                >
                  <Text className="text-red-400">Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {isMe && (
            <Image
              source={{ uri: msg.profileImage }}
              className="w-8 h-8 rounded-full"
            />
          )}
        </View>
      </Swipeable>

      {/* DELETE CONFIRM */}
      <Modal transparent visible={confirmDelete} animationType="fade">
        <View className="flex-1 bg-black/60 justify-center items-center">
          <View className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 w-[80%]">
            <Text className="text-white text-lg mb-3">Delete Message?</Text>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setConfirmDelete(false)}
                className="flex-1 bg-zinc-700 py-2 rounded-lg"
              >
                <Text className="text-center text-white">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setConfirmDelete(false);
                  onDelete();
                }}
                className="flex-1 bg-red-700 py-2 rounded-lg"
              >
                <Text className="text-center text-white">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
