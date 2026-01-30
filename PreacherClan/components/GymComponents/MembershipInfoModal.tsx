import React from "react";
import { Modal, View, Text, Pressable } from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const MembershipInfoModal: React.FC<Props> = ({ visible, onClose }) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View className="flex-1 bg-black/60 justify-center px-6">
        <View className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
          <Text className="text-white text-lg font-semibold mb-2 font-ScienceGothic">
            Membership Info
          </Text>

          <Text className="text-zinc-300 font-ScienceGothic mb-4">
            Your membership progress is calculated based on remaining
            calendar days. Renew early to avoid interruption.
          </Text>

          <Pressable
            onPress={onClose}
            className="self-end bg-zinc-800 px-4 py-2 rounded-md"
          >
            <Text className="text-white font-ScienceGothic">
              Got it
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default MembershipInfoModal;
