import React from "react";
import { Stack } from "expo-router";
import { ReceiptRussianRuble } from "lucide-react-native";


const splitLayout = ()=>{
    return(
        <Stack>

             <Stack.Screen
                    name="index"
                    options={{
                      headerShown: true,
                      animation: 'fade',
            
                      // Title text
                      title: 'BattleForge',
            
                      // Header container styles
                      headerStyle: {
                        backgroundColor: '#0a0a0a',
                      },
            
                      headerTitleStyle: {
                        fontFamily: 'BBH-Bartle', 
                        fontSize: 16,
                        color: '#ffffff',
                      },
            
                      // Center title (Android)
                      headerTitleAlign: 'center',
            
                      // Tint color for back button
                      headerTintColor: '#ffffff',
                    }}
                  />
        </Stack>


    );
}

export default splitLayout ; 
