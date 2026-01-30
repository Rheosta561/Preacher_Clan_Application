import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Star } from "lucide-react-native";

export default function AddReviewModal({
  visible,
  onClose,
  onSubmit,
}: any) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/70 justify-center px-6">
        <View className="bg-zinc-900 p-4 rounded-lg">
          <Text className="text-white text-lg mb-2 font-ScienceGothic">
            Add Review
          </Text>

          {/* Stars */}
          <View className="flex-row gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <TouchableOpacity key={i} onPress={() => setRating(i)}>
                <Star
                  size={24}
                  fill={i <= rating ? "#facc15" : "transparent"}
                  color="#facc15"
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            placeholder="Write your review…"
            placeholderTextColor="#666"
            value={review}
            onChangeText={setReview}
            className="bg-zinc-800 text-white font-ScienceGothic rounded-lg p-3 h-24"
            multiline
          />

          <TouchableOpacity
            onPress={() => onSubmit(rating, review)}
            className="bg-green-600 py-2 rounded-lg mt-4"
          >
            <Text className="text-center font-bartle text-white">
              Submit Review
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            className="mt-2"
          >
            <Text className="text-center font-bartle text-zinc-400">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
