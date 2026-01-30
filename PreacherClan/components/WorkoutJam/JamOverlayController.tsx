import React, { useEffect, useRef, useState } from "react";
import { View, Text } from "react-native";
import { MotiView } from "moti";
import { useRouter } from "expo-router";

import { socketService } from "@/utils/socket";
import ExerciseDoneModal from "@/components/WorkoutJam/ExerciseDoneModal";

/* ================= TYPES ================= */

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  youtube?: string;
  description?: string;
  target_muscles?: string[];
  equipment?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
}

/* ================= COMPONENT ================= */

export default function JamOverlayController({
  jamId,
  userId,
}: {
  jamId: string;
  userId?: string;
}) {
  const router = useRouter();

  /* ================= STATE ================= */

  const [phase, setPhase] = useState<
    "idle" | "countdown" | "exercise" | "waiting" | "completed"
  >("idle");

  const [countdown, setCountdown] = useState(3);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [reward, setReward] = useState<number | null>(null);

  // ✅ per-user completion ticks
  const [completedUsers, setCompletedUsers] = useState<string[]>([]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ================= COUNTDOWN ================= */

  const startCountdown = () => {
    setPhase("countdown");
    setCountdown(3);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          setPhase("exercise");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /* ================= SOCKET EVENTS ================= */

  useEffect(() => {
    const onStarted = ({ exercise }: { exercise: Exercise }) => {
      setCompletedUsers([]);
      setExercise(exercise);
      startCountdown();
    };

    const onNextExercise = ({ exercise }: { exercise: Exercise }) => {
      setCompletedUsers([]);
      setExercise(exercise);
      startCountdown();
    };

    const onUserCompleted = ({ userId }: { userId: string }) => {
      setCompletedUsers(prev =>
        prev.includes(userId) ? prev : [...prev, userId]
      );
    };

    const onCompleted = ({ reward }: { reward: number }) => {
      setReward(reward);
      setPhase("completed");
    };

    socketService.on("jam:started", onStarted);
    socketService.on("jam:nextExercise", onNextExercise);
    socketService.on("jam:userCompleted", onUserCompleted);
    socketService.on("jam:completed", onCompleted);

    return () => {
      socketService.off("jam:started", onStarted);
      socketService.off("jam:nextExercise", onNextExercise);
      socketService.off("jam:userCompleted", onUserCompleted);
      socketService.off("jam:completed", onCompleted);
    };
  }, []);

  /* ================= DONE ================= */

  const completeExercise = () => {
    socketService.emit("jam:exerciseCompleted", {
      jamId,
      userId,
    });

    setPhase("waiting");
    setExercise(null);
  };

  /* ================= AUTO REDIRECT AFTER COMPLETION ================= */

  useEffect(() => {
    if (phase === "completed") {
      const t = setTimeout(() => {
        setPhase("idle");
        router.replace("/(protected)/(tabs)");
      }, 5000);

      return () => clearTimeout(t);
    }
  }, [phase]);

  /* ================= RENDER ================= */

  if (phase === "idle") return null;

  return (
    <View className="absolute inset-0 z-50">

      {/* ===== COUNTDOWN ===== */}
      {phase === "countdown" && (
        <View className="flex-1 bg-black items-center justify-center">
          <MotiView
            from={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            transition={{ type: "timing", duration: 400 }}
          >
            <Text className="text-white text-[120px] font-bartle">
              {countdown === 0 ? "GO" : countdown}
            </Text>
          </MotiView>
        </View>
      )}

      {/* ===== EXERCISE ===== */}
      {phase === "exercise" && (
        <ExerciseDoneModal
          visible
          exercise={exercise}
          onDone={completeExercise}
        />
      )}

      {/* ===== WAITING ===== */}
      {phase === "waiting" && (
        <View className="flex-1 bg-black items-center justify-center">
          <Text className="text-white text-3xl text-center  font-bartle mb-3">
            Waiting for others…
          </Text>

          <Text className="text-zinc-400 mb-6 font-ScienceGothic">
            Hold your ground, warrior
          </Text>

          {/* PER-USER TICKS */}
          <View className="flex-row gap-3">
            {completedUsers.map((_, idx) => (
              <View
                key={idx}
                className="w-12 h-12 rounded-full bg-green-500 items-center justify-center"
              >
                <Text className="text-black text-xl font-bartle">✔</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* ===== COMPLETED ===== */}
      {phase === "completed" && (
        <View className="flex-1 bg-black w-full flex-col  items-center justify-center">
          <Text className="text-white text-4xl text-center w-full font-bartle mb-3">
            JAM COMPLETED 
          </Text>

          <Text className="text-green-400 text-xl font-ScienceGothic mb-1">
            +{reward} Preacher Score
          </Text>

          <Text className="text-zinc-400 font-ScienceGothic">
            Credited to your account
          </Text>
        </View>
      )}
    </View>
  );
}
