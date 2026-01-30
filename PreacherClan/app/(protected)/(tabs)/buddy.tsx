import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";

import RepMateRequestCard from "@/components/RepMateRequestCard";
import SwipeInstructions from "@/components/SwipeInstructions";
import MatchListener from "@/components/MatchListener";
import StackedSwipeCards from "@/components/StackedSwipeCards";
import CustomToast from "@/components/CustomToast";
import { useUser } from "@/context/userContext";
import { transformBackendProfileToUI } from "@/utils/transformProfile";
import { apiFetch } from "@/utils/Auth/apiFetch";



import { Profile, RepMateRequest } from "../../../constants/constants";

import Navbar from "@/components/Utility/Navbar";

const GymBuddyFinderScreen: React.FC = () => {
  const { user, logout } = useUser();
const userId = user?.id;
const PAGE_SIZE = 20;

const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [loadingMore, setLoadingMore] = useState(false);



  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

  /* ---------------- STATE ---------------- */
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [requests, setRequests] = useState<RepMateRequest[]>([]);
  const [index, setIndex] = useState(0);

  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [requestTab, setRequestTab] = useState<"incoming" | "outgoing">(
    "incoming"
  );

  const [toast, setToast] = useState<{
    visible: boolean;
    type: "success" | "info" | "error";
    title: string;
    message?: string;
  }>({
    visible: false,
    type: "success",
    title: "",
  });

  /* ---------------- FETCH REQUESTS ---------------- */
  const fetchRequests = async () => {
    try {
      setLoadingRequests(true);

      const data = await apiFetch<{ requests?: any[] }>(
  `/requests/${userId}`,
  {},
  logout
);

      if (!data?.requests) return;
      const normalized: RepMateRequest[] = data.requests.map((r: any) => {
  const isReceiver = r.receiver.user._id === userId;
  const other = isReceiver ? r.sender : r.receiver;

  return {
    id: r._id,
    status: r.status,
    direction: isReceiver ? "incoming" : "outgoing",


    isVerified: other.user.isVerified,

    profile: {
      id: other.user._id,
      name: other.user.name,
      image:
        other.profile?.profileImage ||
        other.profile?.image ||
        "",
      isVerified: other.user.isVerified, 
    },

    gym: other.gym,
    isTrainer: other.user.isTrainer,
  };
});


      setRequests(normalized);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRequests(false);
    }
  };

// fetching profiles (blatant)
const fetchProfiles = async (pageToLoad = 1, append = false) => {
  if (!userId || loadingMore || (!hasMore && append)) return;

  try {
    append ? setLoadingMore(true) : setLoadingProfiles(true);

    const data = await apiFetch<{ profiles?: any[] }>(
      `/repmate/${userId}?page=${pageToLoad}&limit=${PAGE_SIZE}`,
      {},
      logout
    );

    if (!data?.profiles) return;

    const transformed: Profile[] = data.profiles.map((p: any) =>
      transformBackendProfileToUI(p, handleSendRequest)
    );

    setProfiles(prev =>
      append ? [...prev, ...transformed] : transformed
    );

    setHasMore(transformed.length === PAGE_SIZE);
    setPage(pageToLoad);
  } catch (err) {
    console.error("fetchProfiles error", err);
  } finally {
    setLoadingProfiles(false);
    setLoadingMore(false);
  }
};



// initial fetch
  useEffect(() => {
    if (!userId) return;
    fetchProfiles();
    fetchRequests();
  }, [userId]);

// refreshingg the session
const onRefresh = async () => {
  if (!userId) return;

  try {
    setRefreshing(true);
    setIndex(0);
    setHasMore(true);
    setPage(1);

    await Promise.all([
      fetchProfiles(1, false),
      fetchRequests(),
    ]);
  } finally {
    setRefreshing(false);
  }
};


  const currentProfile = profiles[index];

// send request
const handleSendRequest = async () => {
  if (!currentProfile || !userId) return;

  try {
    await apiFetch(
      `/requests/send/${userId}/${currentProfile.id}`,
      { method: "POST" },
      logout
    );

    setToast({
      visible: true,
      type: "success",
      title: "Request Sent",
      message: `You liked ${currentProfile.name}`,
    });
  } catch (err: any) {
    setToast({
      visible: true,
      type: "error",
      title: "Failed",
      message: err?.message || "Could not send request",
    });
  } finally {
    setIndex(prev => {
      const nextIndex = prev + 1;

      //LOAD NEXT PAGE IF NEEDED
      if (
        nextIndex >= profiles.length - 2 &&
        hasMore &&
        !loadingMore
      ) {
        fetchProfiles(page + 1, true);
      }

      return nextIndex;
    });
  }
};



// reject profile 
  const handleReject = () => {
  if (!currentProfile) return;

  setToast({
    visible: true,
    type: "info",
    title: "Skipped",
    message: `${currentProfile.name} skipped`,
  });

  setIndex(prev => {
    const nextIndex = prev + 1;

    if (
      nextIndex >= profiles.length - 2 &&
      hasMore &&
      !loadingMore
    ) {
      fetchProfiles(page + 1, true);
    }

    return nextIndex;
  });
};


// request handler
const handleAcceptRequest = async (requestId: string) => {
  setRequests((prev) => prev.filter((r) => r.id !== requestId));

  try {
    setToast({
      visible: true,
      type: "success",
      title: "Accepted Request",
      message: "RepMate bonded ⚔️",
    });
    await apiFetch(
      `/requests/${userId}/${requestId}`,
      { method: "POST" },
      logout
    );

    
  } catch (err) {
    console.error(err);
    fetchRequests();
  }
};


const handleRejectRequest = async (requestId: string) => {
  setRequests((prev) => prev.filter((r) => r.id !== requestId));

  try {
    await apiFetch(
      `/requests/reject/${userId}/${requestId}`,
      { method: "POST" },
      logout
    );
  } catch (err) {
    console.error(err);
    fetchRequests();
  }
};


  const filteredRequests = requests.filter(
    (r) => r.direction === requestTab
  );


  return (
    <View className="flex-1 bg-zinc-950">
      <Navbar/>
      <ScrollView>
        <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
            progressViewOffset={120}
          />
        }
      >
        {/* HEADER */}
        <View className="mt-24 items-center">
          <View className="h-32 w-full mt-8 -mb-14">
            <Image
              source={require("../../../assets/images/repmate.png")}
              style={{ height: 100, width: 100 }}
              className="scale-150 ml-8"
              resizeMode="contain"
            />
          </View>

          <SwipeInstructions />

          {/* PROFILES */}
          {loadingProfiles ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : currentProfile ? (
            <StackedSwipeCards
              currentProfile={profiles[index]}
              nextProfile={profiles[index + 1]}
              onAccept={handleSendRequest}
              onReject={handleReject}
            />
          ) : (
            <Text className="text-zinc-400 mt-10 font-ScienceGothic">
              No more profiles. Come back later!
            </Text>
          )}
        </View>

        {/* REQUESTS */}
        <View className="mt-6 px-4">
          <Text className="text-white text-sm mb-3 font-ScienceGothic">
            Pending Requests
          </Text>

          {/* TABS */}
          <View className="flex-row mb-3">
            <TouchableOpacity
              onPress={() => setRequestTab("incoming")}
              className={`flex-1 py-2 ${
                requestTab === "incoming"
                  ? "bg-zinc-800"
                  : "bg-zinc-900"
              }`}
            >
              <Text className="text-center font-ScienceGothic text-white">
                Incoming
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRequestTab("outgoing")}
              className={`flex-1 py-2 ${
                requestTab === "outgoing"
                  ? "bg-zinc-800"
                  : "bg-zinc-900"
              }`}
            >
              <Text className="text-center font-ScienceGothic text-white">
                Outgoing
              </Text>
            </TouchableOpacity>
          </View>

          {loadingRequests ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <FlatList
              horizontal
              data={filteredRequests}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled
              renderItem={({ item }) => (
                <RepMateRequestCard
                  request={item}
                  onAccept={() =>
                    handleAcceptRequest(item.id)
                  }
                  onReject={() =>
                    handleRejectRequest(item.id)
                  }
                />
              )}
            />
          )}
        </View>
      </ScrollView>

      

   {requests.some(r => r.direction === "incoming") && (
  <MatchListener />
)}


      </ScrollView> 
      <CustomToast
        visible={toast.visible}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onHide={() =>
          setToast((prev) => ({ ...prev, visible: false }))
        }
      />
      
    </View>
  );
};

export default GymBuddyFinderScreen;
