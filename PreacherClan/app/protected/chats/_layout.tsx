import { Stack, useLocalSearchParams } from "expo-router";

export default function AuthLayout() {

  const params = useLocalSearchParams();
  const chatTitle =
    typeof params?.name === "string" && params?.name.length > 0
      ? params.name
      : "Raven Speak";

  return (
    <Stack>
      {/* ---------- CHAT LIST ---------- */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          animation: "fade",
          title: "Raven Speak",
          headerStyle: { backgroundColor: "#0a0a0a" },
          headerTitleStyle: {
            fontFamily: "BBH-Bartle",
            fontSize: 16,
            color: "#ffffff",
          },
          headerTitleAlign: "center",
          headerTintColor: "#ffffff",
        }}
      />

      {/* ---------- CHAT SCREEN ---------- */}
      <Stack.Screen
  name="ChatScreen"
  options={({
    route,
  }: {
    route: { params?: { name?: string } };
  }) => {
    const title =
      typeof route.params?.name === "string" && route.params?.name.length > 0
        ? route.params.name
        : "Raven Speak";

    return {
      headerShown: true,
      animation: "slide_from_bottom",
      title,
      headerStyle: { backgroundColor: "#0a0a0a" },
      headerTitleStyle: {
        fontFamily: "BBH-Bartle",
        fontSize: 16,
        color: "#ffffff",
      },
      headerTitleAlign: "center",
      headerTintColor: "#ffffff",
    };
  }}
/>


    </Stack>
  );
}
