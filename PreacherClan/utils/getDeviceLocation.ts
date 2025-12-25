import * as Location from 'expo-location';

export const getDeviceLocation = async () => {
  try {
    // ask permission
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      throw new Error('Location permission denied');
    }

    // current position
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Location error:', error);
    return null;
  }
};
