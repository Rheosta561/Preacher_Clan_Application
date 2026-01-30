import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { X } from "lucide-react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onJoin: (code: string) => void;
  promoImage: string;
  onVisitPromo?: () => void;
  loading : boolean ; 
}

export default function JoinWorkoutJamModal({
  visible,
  onClose,
  onJoin,
  promoImage,
  onVisitPromo,
  loading
}: Props) {
  const [code, setCode] = useState("");

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/80 justify-center items-center px-4">

        <MotiView
          from={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 250 }}
          className="w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950"
        >
          {/* HEADER */}
          <View className="p-4 border-b border-zinc-800">
            <Text className="text-white font-bartle text-xl">
              Join Valhalla Jam
            </Text>
          </View>

          {/* CONTENT */}
          <View className="p-4 gap-4">

            {/* JAM CODE INPUT */}
            <View>
              <Text className="text-zinc-400 text-xs mb-2 font-ScienceGothic">
                Enter Jam Code
              </Text>

              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="e.g. VALHALLA-92X"
                placeholderTextColor="#666"
                className="bg-zinc-900 text-white px-4 py-3 rounded-md font-ScienceGothic tracking-widest"
              />
            </View>

            {/* PROMO CARD */}
            <ImageBackground
              source={{ uri: promoImage }}
              imageStyle={{ borderRadius: 14 }}
              className="h-40 rounded-lg overflow-hidden"
            >
              <LinearGradient
                colors={["rgba(0,0,0,0.15)", "rgba(0,0,0,0.9)"]}
                className="absolute inset-0"
              />

              {/* SPONSORED TAG */}
              <View className="absolute top-3 left-3 bg-black/70 px-2 py-1 rounded-md">
                <Text className="text-[10px] text-zinc-300 tracking-widest font-ScienceGothic">
                  SPONSORED
                </Text>
              </View>

              <View className="absolute inset-0 p-4 justify-end">
                <Text className="text-white font-bartle text-lg">
                  Warrior Fuel
                </Text>

                <Text className="text-zinc-300 text-xs font-ScienceGothic mb-2">
                  Exclusive gear for the clan
                </Text>

                {onVisitPromo && (
                  <TouchableOpacity
                    onPress={onVisitPromo}
                    className="bg-zinc-950 px-4 py-2 rounded-md self-start"
                  >
                    <Text className="text-white text-xs font-ScienceGothic">
                      Visit
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </ImageBackground>

            {/* JOIN BUTTON */}
            <TouchableOpacity
  disabled={loading}
  onPress={() => onJoin(code)}
  className={`py-3 rounded-md ${loading ? "bg-zinc-400" : "bg-black"}`}
>
  {loading ? (

    <ActivityIndicator color="white" />
  ) : (
    <Text className="text-white font-ScienceGothic text-center">Join Jam</Text>
  )}
</TouchableOpacity>


            {/* CLOSE BUTTON (MOVED BELOW) */}
            <TouchableOpacity
              onPress={onClose}
              className="py-2 items-center flex-row justify-center gap-1"
            >
              <X size={16} color="#a1a1aa" />
              <Text className="text-zinc-400 text-sm font-ScienceGothic">
                Close
              </Text>
            </TouchableOpacity>

          </View>
        </MotiView>
      </View>
    </Modal>
  );
}
