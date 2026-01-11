import AsyncStorage from "@react-native-async-storage/async-storage";
import { WorkoutSplit } from "@/constants/split";

const KEY = "USER_SELECTED_SPLIT";

export async function saveSplit(split: WorkoutSplit) {
  await AsyncStorage.setItem(KEY, JSON.stringify(split));
}

export async function loadSplit(): Promise<WorkoutSplit | null> {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : null;
}
