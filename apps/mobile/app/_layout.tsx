import { useColorScheme } from "@/hooks/use-color-scheme";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";
import useLoadFonts from "./hooks/useLoadFonts";
import AppThemeProvider from "./theme/AppThemeProvider";

if (Platform.OS === "web") {
  require("./fonts.css");
}

const isLoggedIn = false;
export default function RootLayout() {
  const colorScheme = useColorScheme();

  const fontsLoaded = useLoadFonts();

  if (Platform.OS !== "web" && !fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppThemeProvider
        colorScheme={colorScheme === "light" ? "light" : "dark"}
      >
        <ThemeProvider
          value={colorScheme === "light" ? DefaultTheme : DarkTheme}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}
