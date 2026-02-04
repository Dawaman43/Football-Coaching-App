import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import './global.css';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const isLoggedIn = false;
export default function RootLayout() {
    const colorScheme = useColorScheme();
    const segments = useSegments();

    const inAuthGroup = segments[0] === '(auth)';

    if (!isLoggedIn && !inAuthGroup) {
        return <Redirect href="/(auth)/login" />;
    }
    return (
        <SafeAreaProvider>
            <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                </Stack>
                <StatusBar style="auto" />
            </ThemeProvider>

        </SafeAreaProvider>
    );
}
