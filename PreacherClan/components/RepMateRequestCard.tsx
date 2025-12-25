import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

interface Props {
  request: any;
  onAccept: () => void;
  onReject: () => void;
}

const RepMateRequestCard: React.FC<Props> = ({
  request,
  onAccept,
  onReject,
}) => {
  const { profile, gym, direction, status } = request;

  // 🔒 SAFE FALLBACKS
  const tags: string[] = profile?.tags ?? [];
  const image =
    profile?.image ||
    profile?.profileImage ||
    "https://via.placeholder.com/150";

  return (
    <View className="w-64 mr-3 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
      {/* IMAGE */}
      <Image
        source={{ uri: image }}
        className="w-full h-32"
        resizeMode="cover"
      />

      {/* CONTENT */}
      <View className="p-3">
        <Text className="text-white font-ScienceGothic font-semibold">
          {profile?.name ?? "Unknown"}
        </Text>

        {gym && (
          <Text className="text-zinc-400 text-xs font-ScienceGothic mt-1">
            {gym}
          </Text>
        )}

        {/* TAGS */}
        {tags.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mt-2">
            {tags.map((tag, idx) => (
              <View
                key={idx}
                className="bg-zinc-800 px-2 py-1 rounded-md"
              >
                <Text className="text-xs font-ScienceGothic text-zinc-300">
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ACTIONS */}
        <View className="mt-3">
          {direction === "incoming" ? (
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={onReject}
                className="flex-1 bg-zinc-800 py-2 rounded-md"
              >
                <Text className="text-center font-ScienceGothic text-zinc-400 text-xs">
                  Reject
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onAccept}
                className="flex-1 bg-zinc-50 py-2 rounded-md"
              >
                <Text className="text-center font-ScienceGothic text-zinc-950 text-xs">
                  Accept
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="bg-zinc-800 py-2 rounded-md">
              <Text className="text-center font-ScienceGothic text-zinc-400 text-xs">
                Status: {status ?? "Pending"}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default RepMateRequestCard;
