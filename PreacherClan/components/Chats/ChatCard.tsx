import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import * as Haptics from "expo-haptics";

export interface ChatParticipant {
  _id: string;
  username?: string;
  name?: string;
  image?: string;
}

export interface ChatCardProps {
  id: string;                                  // receiver userId
  username: string;                            // receiver name
  latestMessage: string;
  timestamp: string;
  profileImage: string;
  sender: string;
  currentUserId: string;
  isGroup?: boolean;
  participants?: ChatParticipant[];            // <-- UPDATED
  unreadCount?: number;
  onPress?: (id: string, chatName: string) => void;
  onDelete?: (id: string) => void;
  onArchive?: (id: string) => void;
}


const ChatCard = ({
  id,
  username,
  latestMessage,
  timestamp,
  profileImage,
  sender,
  currentUserId,
  isGroup = false,
  participants = [],
  unreadCount = 0,
  onPress,
  onDelete,
  onArchive,
}: ChatCardProps) => {

  const [menuOpen, setMenuOpen] = useState(false);

  const senderTag = sender === currentUserId ? "You" : "Preacher";

  const getParticipantPreview = () => {
    const visible = participants.slice(0, 2);
    const remaining = participants.length - visible.length;

    return remaining > 0
      ? `${visible.join(", ")}, +${remaining} more`
      : visible.join(", ");
  };

  const handleLongPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMenuOpen(true);
  };

  return (
    <>
      {/* ROW */}
      <TouchableOpacity
        onPress={() => onPress?.(id , username)}
        onLongPress={handleLongPress}
        delayLongPress={300}
        className="flex-row justify-between items-center px-4 py-6 border-b border-zinc-800"
      >
        {/* LEFT */}
        <View className="flex-row items-center gap-3">
          <Image
            source={{ uri: profileImage }}
            className="w-10 h-10 rounded-full"
          />

          <View>
            <Text className="text-white font-ScienceGothic font-semibold">
              {username}
            </Text>

            {isGroup ? (
              <Text className="text-zinc-400  text-sm font-ScienceGothic" numberOfLines={1}>
                {getParticipantPreview()}
              </Text>
            ) : (
              <Text className="text-zinc-400 font-ScienceGothic text-sm" numberOfLines={1}>
                <Text className="text-zinc-500 font-ScienceGothic font-semibold">
                  {senderTag}
                </Text>{" "}
                | {latestMessage}
              </Text>
            )}
          </View>
        </View>

        {/* RIGHT */}
        <View className="items-end">
          <Text className="text-xs text-zinc-500 font-ScienceGothic">{timestamp}</Text>

          {unreadCount > 0 && (
            <View className="bg-red-800 px-2 py-0.5 rounded-full mt-1">
              <Text className="text-white font-ScienceGothic text-xs">{unreadCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>


      {/* MODAL MENU */}
      <Modal
        transparent
        visible={menuOpen}
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <View className="flex-1 bg-black/60 justify-end">

          <View className="bg-zinc-900 rounded-t-2xl p-5 border border-zinc-800">

            <Text className="text-white font-bartle text-lg mb-4">
              Conversation Options
            </Text>

            <TouchableOpacity
              onPress={() => {
                setMenuOpen(false);
                onArchive?.(id);
              }}
              className="bg-blue-700 py-3 rounded mb-2"
            >
              <Text className="text-white text-center font-ScienceGothic">
                Archive Chat
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setMenuOpen(false);
                onDelete?.(id);
              }}
              className="bg-red-700 py-3 rounded mb-4"
            >
              <Text className="text-white text-center font-ScienceGothic">
                Delete Chat
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMenuOpen(false)}
              className="bg-zinc-800 py-3 rounded"
            >
              <Text className="text-center text-white font-ScienceGothic">
                Cancel
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </>
  );
};

export default ChatCard;
