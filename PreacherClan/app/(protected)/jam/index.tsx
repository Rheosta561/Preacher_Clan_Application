import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { Users, Crown, Copy } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import YoutubePlayer from "react-native-youtube-iframe";

import { socketService } from "@/utils/socket";
import { apiFetch } from "@/utils/Auth/apiFetch";
import { useUser } from "@/context/userContext";
import JamOverlayController from "@/components/WorkoutJam/JamOverlayController";

/* ================= TYPES ================= */

interface JamUser {
  _id: string;
  name: string;
  username: string;
  preacherScore: number;
}

interface JamExercise {
  name: string;
  sets: number;
  reps: number;
  youtube?: string;
}

interface JamResponse {
  _id: string;
  jamCode: string;
  leader: string;
  participants: JamUser[];
  exercises: JamExercise[];
  state: "waiting" | "active" | "completed";
}

/* ================= SCREEN ================= */

export default function JamLobbyScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const router = useRouter();
  const { user } = useUser();

  const isMounted = useRef(true);

  /* ================= STATE ================= */

  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<JamUser[]>([]);
  const [exercises, setExercises] = useState<JamExercise[]>([]);
  const [jamCode, setJamCode] = useState("");
  const [leaderId, setLeaderId] = useState("");
  const [leaderOnline, setLeaderOnline] = useState(true);
  const canStartJam = participants.length >= 2;


  const [jamStarted, setJamStarted] = useState(false);

  const userId = user?.id;
  const isLeader = userId === leaderId;

  /* ================= CLEANUP FLAG ================= */

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  /* ================= FETCH JAM ================= */

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const fetchJam = async () => {
      try {
        const jam = await apiFetch<JamResponse>(`/jam/${id}`);

        if (!isMounted.current || cancelled) return;

        setJamCode(jam.jamCode);
        setParticipants(jam.participants);
        setExercises(jam.exercises ?? []);
        setLeaderId(jam.leader);

        //INIT START STATE
        setJamStarted(jam.state === "active");
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load jam", err);
          router.back();
        }
      } finally {
        if (!cancelled && isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchJam();

    return () => {
      cancelled = true;
    };
  }, [id, router]);

  /* ================= SOCKET ================= */

  useEffect(() => {
    if (!userId || !jamCode) return;

    socketService.emit("jam:join", { jamCode, userId });

    const onUserJoined = (data: { participants: JamUser[] }) => {
      if (!isMounted.current) return;
      setParticipants(data.participants);
      setLeaderOnline(true);
    };

    const onUserLeft = (data: { participants: JamUser[] }) => {
      if (!isMounted.current) return;
      setParticipants(data.participants);
    };

    const onLeaderOffline = () => {
      if (!isMounted.current) return;
      setLeaderOnline(false);
    };

    // WHEN JAM STARTS — HIDE BUTTON FOR EVERYONE
    const onJamStarted = () => {
      setJamStarted(true);
    };

    socketService.on("jam:userJoined", onUserJoined);
    socketService.on("jam:userLeft", onUserLeft);
    socketService.on("jam:leaderOffline", onLeaderOffline);
    socketService.on("jam:started", onJamStarted);

    return () => {
      socketService.off("jam:userJoined", onUserJoined);
      socketService.off("jam:userLeft", onUserLeft);
      socketService.off("jam:leaderOffline", onLeaderOffline);
      socketService.off("jam:started", onJamStarted);
    };
  }, [jamCode, userId]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator color="white" size="large" />
      </View>
    );
  }

  /* ================= UI ================= */

  return (
    <View className="flex-1 bg-black">

      {/* ================= HERO VIDEO ================= */}
      <View className="h-64">
        <YoutubePlayer height={220} play mute videoId="RNkpzDaqOpM" />

        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.9)"]}
          className="absolute inset-0 justify-end p-5 h-full"
        >
          <Text className="text-zinc-400 text-xs tracking-widest">
            JAM LOBBY
          </Text>

          <Text className="text-white text-3xl font-bartle">
            {name}
          </Text>

          <TouchableOpacity
            onPress={() => Clipboard.setStringAsync(jamCode)}
            className="flex-row items-center mt-3 bg-zinc-900 px-4 py-2 rounded-md self-start"
          >
            <Text className="text-white tracking-widest mr-2">
              {jamCode}
            </Text>
            <Copy size={16} color="white" />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* ================= LEADER STATUS ================= */}
      {!leaderOnline && (
        <View className="bg-yellow-500 p-3">
          <Text className="text-black text-center font-ScienceGothic">
            Waiting for leader to rejoin…
          </Text>
        </View>
      )}

      <ScrollView className="flex-1">

        {/* ================= EXERCISES ================= */}
        <View className="p-5">
          <Text className="text-white mb-2 font-bartle">
            Workout Order
          </Text>

          {exercises.map((ex, idx) => (
            <View
              key={idx}
              className="bg-zinc-900 rounded-md p-3 mb-2"
            >
              <Text className="text-white font-ScienceGothic">
                {idx + 1}. {ex.name}
              </Text>
              <Text className="text-zinc-400 text-xs">
                {ex.sets} × {ex.reps}
              </Text>
            </View>
          ))}
        </View>

        {/* ================= PARTICIPANTS ================= */}
        <View className="px-5 pb-10">
          <Text className="text-white mb-3 font-bartle">
            Warriors Joined
          </Text>

          <FlatList
            data={participants}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const isYou = item._id === userId;
              const isLeaderUser = item._id === leaderId;

              return (
                <View className="flex-row items-center bg-white p-4 rounded-lg mb-3">
                  {isLeaderUser ? (
                    <Crown size={18} color="#facc15" />
                  ) : (
                    <Users size={18} color="black" />
                  )}

                  <View className="ml-3">
                    <Text className="text-black font-bartle">
                      {isYou ? "You" : item.name}
                    </Text>
                    <Text className="text-zinc-800 font-ScienceGothic text-xs">
                      @{item.username} • {item.preacherScore} PS
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </ScrollView>

      {/* ================= START JAM ================= */}
{isLeader && leaderOnline && !jamStarted && (
  <TouchableOpacity
    disabled={!canStartJam}
    onPress={() => {
      if (!canStartJam) return;

      socketService.emit("jam:start", {
        jamId: id,
        userId,
      });
    }}
    className={`py-4 mx-5 mb-6 rounded-lg ${
      canStartJam ? "bg-zinc-50" : "bg-zinc-700"
    }`}
  >
    <Text
      className={`text-center text-lg font-bartle ${
        canStartJam ? "text-black" : "text-zinc-400"
      }`}
    >
      {canStartJam
        ? "Start Jam"
        : `Waiting for ${2 - participants.length} more warriors`}
    </Text>
  </TouchableOpacity>
)}


      {/* ================= OVERLAY ================= */}
      <JamOverlayController jamId={id} userId={user?.id} />
    </View>
  );
}
