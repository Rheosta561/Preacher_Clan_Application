import React from "react";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function PromoLayout() {
    return (
        <Stack>
        <Stack.Screen
            name="GettingStarted"
            options={{ headerShown: false, animation: 'fade' }}
        />
        </Stack>
    );
    }   