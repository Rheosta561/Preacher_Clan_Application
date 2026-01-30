import { useEffect, useRef } from "react"
import * as Location from "expo-location"
import { AppState } from "react-native"
import { apiFetch } from "@/utils/Auth/apiFetch"
import { markLocationUpdated, shouldUpdateLocation } from "@/utils/locationCache"
import { useUser } from "@/context/userContext"

export const useLazyLocation = () => {
  const hasUpdatedRef = useRef(false)
  const { user } = useUser()
  const userId = user?.id

  useEffect(() => {
    if (!userId) return

    const updateLocation = async () => {
      if (hasUpdatedRef.current) return

      const shouldUpdate = await shouldUpdateLocation()
      if (!shouldUpdate) return

      const permission = await Location.getForegroundPermissionsAsync()

      if (permission.status !== "granted" && permission.canAskAgain) {
        const req = await Location.requestForegroundPermissionsAsync()
        if (req.status !== "granted") return
      }

      if (permission.status !== "granted") return

      let loc = await Location.getLastKnownPositionAsync()

      if (!loc) {
        try {
          loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          })
        } catch (err: any) {
          console.log("Location unavailable:", err.message)
          return
        }
      }

      hasUpdatedRef.current = true

      await apiFetch("/user/location", {
        method: "POST",
        body: {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          userId,
        },
      })

      await markLocationUpdated()
      console.log("Location updated")
    }


    setTimeout(updateLocation, 2000)

    // ✅ ALSO CALL WHEN APP RETURNS TO FOREGROUND
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        setTimeout(updateLocation, 2000)
      }
    })

    return () => sub.remove()
  }, [userId])
}
