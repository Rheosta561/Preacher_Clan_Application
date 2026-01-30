import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { MotiView, AnimatePresence } from "moti";

/* ================= TYPES ================= */

interface ExerciseDetails {
  name: string;
  sets: number;
  reps: number;
  description?: string;
  image?: string;
  youtube?: string;
  target_muscles?: string[];
  equipment?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
}

interface Props {
  visible: boolean;
  exercise?: ExerciseDetails | null;
  onDone: () => void;
}

/* ================= COMPONENT ================= */

const ExerciseDoneModal = ({ visible, exercise, onDone }: Props) => {
  const screenWidth = Dimensions.get("window").width;
  const videoHeight = (screenWidth - 40) * 0.56;

  /* ---------- YOUTUBE ID ---------- */
  const getYouTubeId = (url?: string) => {
    if (!url) return null;
    const reg =
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_\-]+)/;
    const match = url.match(reg);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(exercise?.youtube);

  const [playing, setPlaying] = useState(false);

  /* ---------- AUTO PAUSE ---------- */
  useEffect(() => {
    if (!visible) setPlaying(false);
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none">
      <AnimatePresence>
        {visible && exercise && (
          <View className="flex-1 bg-black/80 items-center justify-center">

            <MotiView
              from={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "timing", duration: 250 }}
              className="bg-red-600 w-[88%] rounded-xl overflow-hidden"
            >
              {/* ===== VIDEO / IMAGE ===== */}
              {videoId ? (
                <YoutubePlayer
                  height={videoHeight}
                  width={screenWidth - 40}
                  videoId={videoId}
                  play={playing}
                  onChangeState={(state: string) => {
                    if (state === "ended") setPlaying(false);
                  }}
                />
              ) : (
                <Image
                  source={{
                    uri: exercise.image ?? "https://placehold.co/600x400",
                  }}
                  className="w-full h-52"
                />
              )}

              {/* ===== CONTENT ===== */}
              <View className="p-5">
                <Text className="font-bartle text-2xl mb-2">
                  {exercise.name}
                </Text>

                <Text className="font-ScienceGothic text-md mb-3 text-zinc-900">
                  {exercise.sets} Sets × {exercise.reps} Reps
                </Text>

                {/* Target Muscles */}
                {exercise.target_muscles?.length ? (
                  <>
                    <Text className="font-bartle text-md mb-1">
                      Target Muscles
                    </Text>

                    <View className="flex-row flex-wrap gap-2 mb-3">
                      {exercise.target_muscles.map((m, i) => (
                        <View
                          key={i}
                          className="bg-black px-3 py-1 rounded-md"
                        >
                          <Text className="font-ScienceGothic text-sm text-zinc-50">
                            {m}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </>
                ) : null}

                {/* Description */}
                <Text className="font-bartle text-md mb-1">
                  Exercise Guide
                </Text>

                <Text className="text-zinc-900 mb-4 font-ScienceGothic leading-5">
                  {exercise.description ??
                    "A warrior trains with intent. Execute with control."}
                </Text>

                {/* Extra Info */}
                {exercise.equipment && (
                  <Text className="text-sm font-ScienceGothic text-zinc-900 mb-1">
                    Equipment: {exercise.equipment}
                  </Text>
                )}

                {exercise.difficulty && (
                  <Text className="text-sm font-ScienceGothic text-zinc-900 mb-4">
                    Difficulty: {exercise.difficulty}
                  </Text>
                )}

                {/* ===== DONE BUTTON ===== */}
                <TouchableOpacity
                  onPress={onDone}
                  className="bg-black rounded-md py-3"
                >
                  <Text className="text-center text-white font-bartle text-lg">
                    DONE
                  </Text>
                </TouchableOpacity>
              </View>
            </MotiView>
          </View>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default ExerciseDoneModal;
