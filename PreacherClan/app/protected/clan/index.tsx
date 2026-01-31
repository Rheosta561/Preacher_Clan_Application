import { BarcodeScanningResult, Camera, CameraView } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import AddReviewModal from "@/components/GymComponents/AddReviewModal";
import GymGallery from "@/components/GymComponents/Gallery";
import GymReviews from "@/components/GymComponents/GymReviews";
import JoinClanCard from "@/components/GymComponents/JoinClanCard";
import { useUser } from "@/context/userContext";
import { apiFetch } from "@/utils/Auth/apiFetch";

import OtpInput from "@/components/GymComponents/OtpInput";
import { showToast } from "@/utils/showToast";

/* ================= MOCK TOGGLE ================= */
const USE_MOCK = true;

/* ================= MOCK DATA ================= */
const mockGallery: string[] = [
  "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61",
  "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
  "https://images.unsplash.com/photo-1576678927484-cc907957088c",
  "https://images.unsplash.com/photo-1558611848-73f7eb4001a1",
];

const mockReviews = [
  {
    _id: "review1",
    rating: 5,
    review: "Absolutely insane vibe. The clan energy is real.",
    userId: {
      _id: "u1",
      name: "Ragnar Lothbrok",
      username: "ragnar",
      preacherScore: 420,
    },
    createdAt: "2025-01-12",
  },
  {
    _id: "review2",
    rating: 4,
    review: "Great equipment and trainers. Sauna is 🔥",
    userId: {
      _id: "u2",
      name: "Bjorn Ironside",
      username: "bjorn",
      preacherScore: 350,
    },
    createdAt: "2025-01-08",
  },
  {
    _id: "review3",
    rating: 3,
    review: "Crowded during peak hours but worth it.",
    userId: {
      _id: "u3",
      name: "Floki",
      username: "floki",
      preacherScore: 210,
    },
    createdAt: "2025-01-05",
  },
];

export default function JoinClanScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, logout } = useUser();

  const [gym, setGym] = useState<any>(null);
  const [fetchingGym, setFetchingGym] = useState(true);
  const [joining, setJoining] = useState(false);

  const [manualCode, setManualCode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const [showReviewModal, setShowReviewModal] = useState(false);

  //   pagination for reviews
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewCursor, setReviewCursor] = useState<string | null>(null);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);
  const [loadingMoreReviews, setLoadingMoreReviews] = useState(false);
  const REVIEWS_PAGE_SIZE = 2;

  // fetching reviews
  useEffect(() => {
    if (USE_MOCK) {
      const firstPage = mockReviews.slice(0, REVIEWS_PAGE_SIZE);
      setReviews(firstPage);
      setReviewCursor(firstPage[firstPage.length - 1]?._id ?? null);
      setHasMoreReviews(mockReviews.length > REVIEWS_PAGE_SIZE);
    }
  }, []);

  const fetchMoreReviews = async () => {
    if (loadingMoreReviews || !hasMoreReviews) return;

    try {
      setLoadingMoreReviews(true);

      if (USE_MOCK) {
        // simulate cursor pagination
        const startIndex = mockReviews.findIndex((r) => r._id === reviewCursor);

        const nextPage = mockReviews.slice(
          startIndex + 1,
          startIndex + 1 + REVIEWS_PAGE_SIZE,
        );

        if (nextPage.length === 0) {
          setHasMoreReviews(false);
          return;
        }

        setReviews((prev) => [...prev, ...nextPage]);
        setReviewCursor(nextPage[nextPage.length - 1]._id);

        if (startIndex + 1 + REVIEWS_PAGE_SIZE >= mockReviews.length) {
          setHasMoreReviews(false);
        }
      }

      // 🔮 FUTURE REAL API
      /*
    const data = await apiFetch(
      `/review/gym/${gym._id}?cursor=${reviewCursor}&limit=5`,
      {},
      logout
    );

    setReviews(prev => [...prev, ...data.reviews]);
    setReviewCursor(data.nextCursor);
    setHasMoreReviews(data.hasMore);
    */
    } finally {
      setLoadingMoreReviews(false);
    }
  };

  /* ================= FETCH GYM ================= */

  useEffect(() => {
    const fetchGym = async () => {
      try {
        setFetchingGym(true);
        const data = await apiFetch<{ gym: any }>(`/gym/gym/${id}`, {}, logout);
        setGym(data.gym || data);
      } catch {
        Alert.alert("Gym not found");
        router.back();
      } finally {
        setFetchingGym(false);
      }
    };

    if (id) fetchGym();
  }, [id]);

  /* ================= CAMERA PERMISSION ================= */
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  /* ================= JOIN ================= */
  const joinWithCode = async (code: string) => {
    if (joining) return;

    if (!/^\d{6}$/.test(code)) {
      Alert.alert("Invalid Code", "Enter a valid 6-digit clan code");
      return;
    }

    try {
      setJoining(true);
      await apiFetch(`/join/${code}/${user?.id}`, { method: "GET" }, logout);

      showToast({
        type: "success",
        title: `Joined ${gym?.name}`,
        message: "Successfully joined the Gym",
      });

      router.replace("/protected/tabs");
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Failed Joining the Gym",
        message: err.message,
      });
      //   Alert.alert("Join Failed", err.message || "Invalid clan code");
    } finally {
      setJoining(false);
    }
  };

  const onBarcodeScanned = ({ data }: BarcodeScanningResult) => {
    if (joining) return;

    const match = data.match(/\d{6}/);
    if (!match) {
      Alert.alert("Invalid QR", "No valid clan code found");
      return;
    }

    setScanning(false);
    joinWithCode(match[0]);
  };

  /* ================= ADD REVIEW ================= */
  const submitReview = async (rating: number, review: string) => {
    try {
      await apiFetch(
        `/review/${gym._id}`,
        { method: "POST", body: { rating, review } },
        logout,
      );

      showToast({ type: "success", title: "Review Added" });
      setShowReviewModal(false);
    } catch {
      Alert.alert("Failed to add review");
    }
  };

  /* ================= LOADING ================= */
  if (fetchingGym) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-zinc-400 mt-2 font-ScienceGothic">
          Loading Gym…
        </Text>
      </View>
    );
  }

  /* ================= UI ================= */
  return (
    <>
      <ScrollView className="flex-1 bg-zinc-950 px-4 pt-4">
        <Text className="text-zinc-400 text-sm mb-4 font-ScienceGothic">
          Join this gym and become a Preacher
        </Text>

        {/* GYM CARD */}
        <View className="bg-zinc-900 rounded-lg mb-4 overflow-hidden">
          <JoinClanCard gym={gym} />
        </View>

        {/* GALLERY */}
        <View className="mt-4">
          <GymGallery images={USE_MOCK ? mockGallery : (gym?.gallery ?? [])} />
        </View>

        {/* JOIN CODE */}
        <Text className="text-zinc-300 mt-6  font-ScienceGothic">
          Enter 6-digit Clan Code
        </Text>
        <OtpInput value={manualCode} onChange={setManualCode} />

        <TouchableOpacity
          disabled={joining}
          onPress={() => joinWithCode(manualCode)}
          className={`py-3 rounded-lg ${
            joining ? "bg-green-800" : "bg-green-600"
          }`}
        >
          {joining ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-center text-white font-ScienceGothic">
              Join with Code
            </Text>
          )}
        </TouchableOpacity>

        {/* 📷 QR */}
        <View className="flex-row items-center my-6">
          <View className="flex-1 h-[1px] bg-zinc-700" />
          <Text className="mx-3 text-zinc-400 font-ScienceGothic text-sm">
            OR
          </Text>
          <View className="flex-1 h-[1px] bg-zinc-700" />
        </View>
        <TouchableOpacity
          onPress={() => setScanning((p) => !p)}
          className={` py-3 rounded-lg ${
            scanning ? "bg-red-700" : "bg-zinc-900"
          }`}
        >
          <Text className="text-center text-white font-ScienceGothic">
            {scanning ? "Stop Scanning" : "Scan QR Code"}
          </Text>
        </TouchableOpacity>

        {scanning && hasPermission && (
          <View className="mt-4 h-72 rounded-lg overflow-hidden">
            <CameraView
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              onBarcodeScanned={onBarcodeScanned}
              style={{ flex: 1 }}
            />
          </View>
        )}

        {/* 📝 REVIEWS */}
        <View className="mt-6">
          <Text className="text-white font-ScienceGothic text-lg mb-2">
            Reviews
          </Text>

          <GymReviews reviews={reviews} />
          {hasMoreReviews && (
            <TouchableOpacity
              onPress={fetchMoreReviews}
              disabled={loadingMoreReviews}
              className="mt-3 bg-zinc-800 py-2 rounded-lg"
            >
              {loadingMoreReviews ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-center text-white font-ScienceGothic">
                  Load more reviews
                </Text>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => setShowReviewModal(true)}
            className="mt-3 bg-zinc-50 py-2 rounded-md"
          >
            <Text className="text-center text-zinc-950 font-ScienceGothic">
              Add Review
            </Text>
          </TouchableOpacity>
        </View>

        <View className="h-24" />
      </ScrollView>

      {/* ⭐ ADD REVIEW MODAL */}
      <AddReviewModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={submitReview}
      />
    </>
  );
}
