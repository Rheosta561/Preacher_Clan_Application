import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { ScanLine, ShieldCheck } from "lucide-react-native";

const StreakMarker: React.FC = () => {
  const [status, setStatus] = useState<"idle" | "scanning" | "success">("idle");
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setScannedCode(data);
    setStatus("success");

    // 🔗 Backend redirect / API call goes here
    // fetch(`/streak/${data}`)
  };

  return (
    <View className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 items-center">
      <Text className="text-white text-xl font-ScienceGothic font-semibold">
        RuneStreak Marker
      </Text>
      <Text className="text-zinc-400 font-ScienceGothic text-sm mt-1">
        Mark your streak with honor
      </Text>

      {/* BUTTONS */}
      {status === "idle" && (
        <TouchableOpacity
          onPress={() => setStatus("scanning")}
          className="flex-row items-center gap-2 bg-green-800 px-6 py-3 rounded-lg mt-4"
        >
          <ScanLine size={18} color="white" />
          <Text className="text-white font-semibold font-ScienceGothic">Scan Rune QR</Text>
        </TouchableOpacity>
      )}

      {status === "scanning" && (
        <>
          {/* CAMERA VIEW */}
          <View className="mt-4 w-72 h-72 overflow-hidden rounded-xl border border-green-700">
            <CameraView
              className="flex-1"
              facing="back"
              onBarcodeScanned={handleBarcodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
            />
          </View>

          <TouchableOpacity
            onPress={() => setStatus("idle")}
            className="bg-red-800 px-6 py-2 rounded-lg mt-3"
          >
            <Text className="text-white">Stop Scanning</Text>
          </TouchableOpacity>
        </>
      )}

      {/* SUCCESS */}
      {status === "success" && (
        <View className="items-center mt-4">
          <ShieldCheck size={42} color="#22c55e" />
          <Text className="text-green-400 mt-2 text-sm">
            Rune marked successfully
          </Text>
          <Text className="text-zinc-500 text-xs mt-1">
            Code: {scannedCode}
          </Text>
        </View>
      )}
    </View>
  );
};

export default StreakMarker;
