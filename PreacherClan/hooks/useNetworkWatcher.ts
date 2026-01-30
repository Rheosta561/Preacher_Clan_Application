import { useEffect } from "react"
import * as Network from "expo-network"
import { showToast } from "@/utils/showToast"

export function useNetworkWatcher() {
  useEffect(() => {
    const sub = Network.addNetworkStateListener((state) => {
      const online =
        state.isConnected === true &&
        state.isInternetReachable === true

      showToast({
        type: online ? "success" : "error",
        title: online ? "Back Online" : "No Internet",
        message: online ? undefined : "Please check your connection",
      })
    })

    return () => sub.remove()
  }, [])
}
