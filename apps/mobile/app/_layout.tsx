import { RoleProvider } from "@/context/RoleContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme
} from "@react-navigation/native";
import { Slot, SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";
import useLoadFonts from "./hooks/useLoadFonts";
import AppThemeProvider from "./theme/AppThemeProvider";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

if (Platform.OS === "web") {
  require("./fonts.css");
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const fontsLoaded = useLoadFonts();
  const theme = colorScheme === "light" ? DefaultTheme : DarkTheme;
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for fonts to load
        if (fontsLoaded || Platform.OS === "web") {
          setAppIsReady(true);
        }
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, [fontsLoaded]);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <RoleProvider>
          <AppThemeProvider
            colorScheme={colorScheme === "light" ? "light" : "dark"}
          >
            <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
              <Slot />
              <StatusBar style={colorScheme === "light" ? "dark" : "light"} />
            </View>
          </AppThemeProvider>
        </RoleProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
