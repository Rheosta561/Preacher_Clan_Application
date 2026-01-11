import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import ShareCard from "@/components/Challenge/ShareCard";
import ViewShot from "react-native-view-shot";
import StreakHeader from "@/components/Challenge/StreakHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Instagram, Share2, Download, Facebook } from "lucide-react-native";
import CustomToast from "@/components/CustomToast";


import { useChallenge } from "@/context/ChallengeContext";
import VikingCompleted from "@/components/Challenge/ChallengeComplete";
import axios from "axios";
import { useUser } from "@/context/userContext";


const ChallengeScreen = () => {

  const { challenge, loading , setChallenge } = useChallenge();
  const [image, setImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const viewShotRef = useRef<ViewShot>(null);


  // toaster
  const [toastVisible, setToastVisible] = useState(false);
const [toastType, setToastType] = useState<"success" | "error" | "info">("info");
const [toastTitle, setToastTitle] = useState("");
const [toastMsg, setToastMsg] = useState("");


const showToast = (
  type: "success" | "info" | "error",
  title: string,
  message?: string
) => {
  setToastType(type);
  setToastTitle(title);
  setToastMsg(message || "");
  setToastVisible(true);
};


const hideToast = () => setToastVisible(false);
const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

const {user} = useUser();
const userId = user?.id;





  // check for rendering animations 
  const completed = challenge?.isCompleted === true;


  /* ---------------- MARK CHALLENGE COMPLETE ---------------- */


  const markChallengeCompleted = async () => {
    const today = new Date().toISOString();

    await AsyncStorage.setItem("lastChallengeCompletedDate", today);
    try {
      console.log(userId)
      const res = await axios.post(`${backendUrl}/challenge/complete/${userId}` , {});
      console.log('challenge completion response ', res.data);
      if(res.status===200){
        setChallenge(res.data.challenge);
        showToast('success' , `${challenge?.title} achieved` , 'Challenge Completed now inspire others ');
      }


      
    } catch (error) {
      console.error('challenge completion error ', error);
      showToast('error' , 'Server is Busy' , 'Server is busy , try again later ');
    }
  };


  /* PICK IMAGE */
  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    });

    if (!res.canceled) {
      setImage(res.assets[0].uri);
      setModalVisible(true);
    }
  };


  /* SAVE IMAGE */
  const saveImage = async () => {
    const uri = await viewShotRef.current?.capture?.();
    if (!uri) return;

    await MediaLibrary.saveToLibraryAsync(uri);
    await markChallengeCompleted();

    showToast("success" , "Image saved to gallery " );

    // alert("Saved to gallery — Challenge Completed!");
  };





  /* SHARE TO INSTAGRAM */
  const shareInstagram = async () => {
    const uri = await viewShotRef.current?.capture?.();
    if (!uri) return;

    await Sharing.shareAsync(uri, {
      UTI: "com.instagram.sharedSticker",
      mimeType: "image/png"
    });

    await markChallengeCompleted();
    showToast("success", "Shared on Instagram", "Your grind inspires the clan.");
  };


  /* SHARE ANYWHERE */
  const shareGeneral = async () => {
    const uri = await viewShotRef.current?.capture?.();
    if (!uri) return;

    await Sharing.shareAsync(uri);

    await markChallengeCompleted();
    showToast("info", "Shared", "Your progress was shared successfully.");
  };


  if(completed){
    return(
       <ScrollView className="flex-1 bg-zinc-950 px-4 pb-20">
         <CustomToast
  visible={toastVisible}
  type={toastType}
  title={toastTitle}
  message={toastMsg}
  onHide={hideToast}
/>

      <StreakHeader />
      <VikingCompleted onPress = {pickImage}/>

      {/* LOADING */}
      {loading && (
        <Text className="text-white font-ScienceGothic mt-4">
          Summoning Odin’s Challenge...
        </Text>
      )}

      {/* NO CHALLENGE */}
      {!loading && !challenge && (
        <Text className="text-white font-ScienceGothic mt-4">
          No challenge available today ⚔️
        </Text>
      )}


      {/* TITLE */}
      <Text className="text-white text-3xl font-bartle mb-2">
        {challenge?.title ?? "Challenge"}
      </Text>

      {/* DESCRIPTION */}
      <Text className="text-zinc-400 font-ScienceGothic mb-4">
        {challenge?.description ?? ""}
      </Text>


      {/* RULES */}
      {challenge?.rules && (
        <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-4">
          <Text className="text-white text-lg font-ScienceGothic mb-2">
            Challenge Rules
          </Text>

          {challenge.rules.map((r, i) => (
            <Text key={i} className="text-zinc-400 font-ScienceGothic mb-1">
              • {r}
            </Text>
          ))}
        </View>
      )}


      {/* DISCLAIMER */}
      <Text className="text-xs text-zinc-500 font-ScienceGothic mb-6">
        ⚠️ Upload an image to complete this challenge. 
        Your submission may be shared publicly to motivate others.
      </Text>


      {/* COMPLETE BUTTON */}
      <TouchableOpacity
        disabled={!challenge}
        onPress={pickImage}
        className={`py-3 rounded-md  ${
          challenge ? "bg-red-600" : "bg-zinc-800"
        }`}
      >
        <Text className="text-white text-center font-ScienceGothic text-lg">
          {challenge ? "Complete Challenge" : "No Challenge Available"}
        </Text>
      </TouchableOpacity>

      <View className="m-50 h-20 w-full">


      </View>



      {/* ================== MODAL ================== */}
      <Modal visible={modalVisible} transparent animationType="slide">

        <View className="flex-1 bg-black/70 justify-center items-center px-3">

          <View className="bg-zinc-950 rounded-2xl p-4 border border-zinc-800 w-full">

            {image && (
              <ShareCard
                ref={viewShotRef}
                image={image}
                streakLabel="🔥 Another day crushed!"
                challengeTitle={challenge?.title ?? "Challenge of the Day"}
                streak={10}
              />
            )}

            <View className="mt-4 flex flex-row items-center gap-8 justify-center">


              {/* Instagram */}
              <TouchableOpacity
                onPress={shareInstagram}
                className="bg-zinc-50 p-4 rounded-full flex flex-row items-center"
              >
                <Instagram color="black" size={28} />
              </TouchableOpacity>


              {/* Facebook */}
              <TouchableOpacity
                onPress={shareInstagram}
                className="bg-zinc-50 p-4 rounded-full flex flex-row items-center"
              >
                <Facebook color="black" size={28} />
              </TouchableOpacity>


              {/* General Share */}
              <TouchableOpacity
                onPress={shareGeneral}
                className="bg-zinc-50 p-4 rounded-full flex flex-row items-center"
              >
                <Share2 color="black" size={28} />
              </TouchableOpacity>


              {/* Save */}
              <TouchableOpacity
                onPress={saveImage}
                className="bg-zinc-50 p-4 rounded-full flex flex-row items-center"
              >
                <Download color="black" size={28} />
              </TouchableOpacity>

            </View>


            {/* Close */}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-6 bg-red-600 p-4 rounded-lg"
            >
              <Text className="text-zinc-950 text-center font-ScienceGothic font-semibold">
                Close
              </Text>
            </TouchableOpacity>

          </View>

        </View>

      </Modal>
     


    </ScrollView>

    )
  }

  return (
    <ScrollView className="flex-1 bg-zinc-950 px-4 pb-20">

      <StreakHeader />
      {/* <VikingCompleted onPress = {pickImage}/> */}

      {/* LOADING */}
      {loading && (
        <Text className="text-white font-ScienceGothic mt-4">
          Summoning Odin’s Challenge...
        </Text>
      )}

      {/* NO CHALLENGE */}
      {!loading && !challenge && (
        <Text className="text-white font-ScienceGothic mt-4">
          No challenge available today ⚔️
        </Text>
      )}


      {/* TITLE */}
      <Text className="text-white text-3xl font-bartle mb-2">
        {challenge?.title ?? "Challenge"}
      </Text>

      {/* DESCRIPTION */}
      <Text className="text-zinc-400 font-ScienceGothic mb-4">
        {challenge?.description ?? ""}
      </Text>


      {/* RULES */}
      {challenge?.rules && (
        <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-4">
          <Text className="text-white text-lg font-ScienceGothic mb-2">
            Challenge Rules
          </Text>

          {challenge.rules.map((r, i) => (
            <Text key={i} className="text-zinc-400 font-ScienceGothic mb-1">
              • {r}
            </Text>
          ))}
        </View>
      )}


      {/* DISCLAIMER */}
      <Text className="text-xs text-zinc-500 font-ScienceGothic mb-6">
        ⚠️ Upload an image to complete this challenge. 
        Your submission may be shared publicly to motivate others.
      </Text>


      {/* COMPLETE BUTTON */}
      <TouchableOpacity
        disabled={!challenge}
        onPress={pickImage}
        className={`py-3 rounded-md ${
          challenge ? "bg-red-600" : "bg-zinc-800"
        }`}
      >
        <Text className="text-white text-center font-ScienceGothic text-lg">
          {challenge ? "Complete Challenge" : "No Challenge Available"}
        </Text>
      </TouchableOpacity>



      {/* ================== MODAL ================== */}
      <Modal visible={modalVisible} transparent animationType="slide">

        <View className="flex-1 bg-black/70 justify-center items-center px-3">

          <View className="bg-zinc-950 rounded-2xl p-4 border border-zinc-800 w-full">

            {image && (
              <ShareCard
                ref={viewShotRef}
                image={image}
                streakLabel="🔥 Another day crushed!"
                challengeTitle={challenge?.title ?? "Challenge of the Day"}
                streak={10}
              />
            )}

            <View className="mt-4 flex flex-row items-center gap-8 justify-center">


              {/* Instagram */}
              <TouchableOpacity
                onPress={shareInstagram}
                className="bg-zinc-50 p-4 rounded-full flex flex-row items-center"
              >
                <Instagram color="black" size={28} />
              </TouchableOpacity>


              {/* Facebook */}
              <TouchableOpacity
                onPress={shareInstagram}
                className="bg-zinc-50 p-4 rounded-full flex flex-row items-center"
              >
                <Facebook color="black" size={28} />
              </TouchableOpacity>


              {/* General Share */}
              <TouchableOpacity
                onPress={shareGeneral}
                className="bg-zinc-50 p-4 rounded-full flex flex-row items-center"
              >
                <Share2 color="black" size={28} />
              </TouchableOpacity>


              {/* Save */}
              <TouchableOpacity
                onPress={saveImage}
                className="bg-zinc-50 p-4 rounded-full flex flex-row items-center"
              >
                <Download color="black" size={28} />
              </TouchableOpacity>

            </View>


            {/* Close */}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-6 bg-red-600 p-4 rounded-lg"
            >
              <Text className="text-zinc-950 text-center font-ScienceGothic font-semibold">
                Close
              </Text>
            </TouchableOpacity>

          </View>

        </View>

      </Modal>
      <CustomToast
  visible={toastVisible}
  type={toastType}
  title={toastTitle}
  message={toastMsg}
  onHide={hideToast}
/>


    </ScrollView>
  );
};

export default ChallengeScreen;
