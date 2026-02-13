import { RefreshProvider } from "@/context/RefreshContext";
import { RoleProvider } from "@/context/RoleContext";
import { AppLockProvider } from "@/context/AppLockContext";
import { ReduxProvider } from "@/store/Provider";
import { AuthPersist } from "@/store/AuthPersist";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import { LogBox, Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppLockGate } from "@/components/AppLockGate";
import "./global.css";
import useLoadFonts from "./hooks/useLoadFonts";
import AppThemeProvider from "./theme/AppThemeProvider";

SplashScreen.preventAutoHideAsync();

LogBox.ignoreLogs([
  "SafeAreaView has been deprecated",
]);

if (__DEV__) {
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    const firstArg = typeof args[0] === "string" ? args[0] : "";
    if (firstArg.includes("SafeAreaView has been deprecated")) {
      return;
    }
    originalWarn(...args);
  };
}

if (Platform.OS === "web") {
  require("./fonts.css");
}

function GlobalRefreshLayout({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <View
      className={colorScheme === "dark" ? "dark" : ""}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      {children}
    </View>
  );
}

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const fontsLoaded = useLoadFonts();
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
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
      <ReduxProvider>
        <SafeAreaProvider>
          <RoleProvider>
            <AppLockProvider>
              <AppThemeProvider>
                <RefreshProvider>
                  <GlobalRefreshLayout>
                  <Stack
                    screenOptions={{ headerShown: false, animation: "none" }}
                  />
                  <StatusBar
                    style={colorScheme === "dark" ? "light" : "dark"}
                  />
                  <AppLockGate />
                  <AuthPersist />
                </GlobalRefreshLayout>
                </RefreshProvider>
              </AppThemeProvider>
            </AppLockProvider>
          </RoleProvider>
        </SafeAreaProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
}
