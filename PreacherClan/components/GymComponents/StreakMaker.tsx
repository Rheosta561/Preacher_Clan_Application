import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { ScanLine, ShieldCheck } from "lucide-react-native";

const StreakMarker: React.FC = () => {
  const [status, setStatus] = useState<"idle" | "scanning" | "success">("idle");
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  /* ================= PERMISSION ================= */

  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) {
      requestPermission();
    }
  }, [permission]);

  /* ================= SCAN HANDLER ================= */

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scannedCode) return; // 🔒 prevent multiple scans

    setScannedCode(data);
    setStatus("success");

    // 🔗 Backend API call here
    // fetch(`/streak/${data}`)
  };

  /* ================= PERMISSION UI ================= */

  if (!permission) {
    return (
      <View className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 items-center">
        <ActivityIndicator color="white" />
        <Text className="text-zinc-400 mt-2 font-ScienceGothic">
          Requesting camera permission
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 items-center">
        <Text className="text-white text-center mb-3 font-ScienceGothic">
          Camera access is required to scan the Rune
        </Text>

        <TouchableOpacity
          onPress={requestPermission}
          className="bg-green-800 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-ScienceGothic">
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ================= MAIN UI ================= */

  return (
    <View className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 items-center">
      {/* HEADER */}
      <Text className="text-white text-xl font-ScienceGothic font-semibold">
        RuneStreak Marker
      </Text>
      <Text className="text-zinc-400 font-ScienceGothic text-sm mt-1">
        Mark your streak with honor
      </Text>

      {/* IDLE */}
      {status === "idle" && (
        <TouchableOpacity
          onPress={() => {
            setScannedCode(null);
            setStatus("scanning");
          }}
          className="flex-row items-center gap-2 bg-green-800 px-6 py-3 rounded-lg mt-4"
        >
          <ScanLine size={18} color="white" />
          <Text className="text-white font-semibold font-ScienceGothic">
            Scan Rune QR
          </Text>
        </TouchableOpacity>
      )}

      {/* CAMERA (SCANNING + SUCCESS) */}
      {(status === "scanning" || status === "success") && (
        <>
          <View className="mt-4 w-72 h-72 rounded-xl overflow-hidden border border-green-700 relative">
            {/* CAMERA FEED */}
            <CameraView
              className="flex-1"
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
              onBarcodeScanned={
                status === "scanning" ? handleBarcodeScanned : undefined
              }
            />

            {/* SUCCESS OVERLAY */}
            {status === "success" && (
              <View className="absolute inset-0 bg-black/60 items-center justify-center">
                <ShieldCheck size={48} color="#22c55e" />
                <Text className="text-green-400 mt-2 text-sm font-ScienceGothic">
                  Rune marked successfully
                </Text>
                <Text className="text-zinc-400 text-xs mt-1">
                  Code: {scannedCode}
                </Text>
              </View>
            )}
          </View>

          {/* STOP BUTTON */}
          <TouchableOpacity
            onPress={() => {
              setScannedCode(null);
              setStatus("idle");
            }}
            className="bg-red-800 px-6 py-2 rounded-lg mt-3"
          >
            <Text className="text-white font-ScienceGothic">
              Stop Scanning
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default StreakMarker;
