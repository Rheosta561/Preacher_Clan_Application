import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";

export default function GymGallery({ images = [] }: { images: string[] }) {
  const [active, setActive] = useState<string | null>(null);

  if (!images.length) return null;

  return (
    <>
      {/* Thumbnails */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={images}
        keyExtractor={(i, idx) => `${i}-${idx}`}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setActive(item)}>
            <Image
              source={{ uri: item }}
              className="h-24 w-32 mr-2 rounded-lg"
            />
          </TouchableOpacity>
        )}
      />

      {/* Fullscreen */}
      <Modal visible={!!active} transparent>
        <TouchableOpacity
          className="flex-1 bg-black items-center justify-center"
          onPress={() => setActive(null)}
        >
          <Image
            source={{ uri: active! }}
            resizeMode="contain"
            className="w-full h-full"
          />
        </TouchableOpacity>
      </Modal>
    </>
  );
}
