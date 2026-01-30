import AsyncStorage from "@react-native-async-storage/async-storage"

const LOCATION_TS_KEY = "last_location_update_ts"
const FIFTEEN_MIN = 15 * 60 * 1000

export const shouldUpdateLocation = async (): Promise<boolean> => {
  const ts = await AsyncStorage.getItem(LOCATION_TS_KEY)
  if (!ts) return true

  return Date.now() - Number(ts) > FIFTEEN_MIN
}

export const markLocationUpdated = async () => {
  await AsyncStorage.setItem(LOCATION_TS_KEY, Date.now().toString())
}
