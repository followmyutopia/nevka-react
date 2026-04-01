/**
 * Nevka Mobile v1.8
 * 2025-2026 Avicus Delacroix
 */

import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import NevkaProvider from "../providers/nevkaProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "@/src/components/useColorScheme";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "Невка",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <NevkaProvider>
        <GestureHandlerRootView>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="signup"
              options={{ presentation: "modal", headerShown: false }}
            />
            <Stack.Screen
              name="passwordReset"
              options={{ presentation: "modal", headerShown: false }}
            />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="settings"
              options={{ presentation: "modal", headerShown: false }}
            />
            <Stack.Screen
              name="create-wall"
              options={{ presentation: "modal", headerShown: false }}
            />
            <Stack.Screen
              name="agreement"
              options={{ presentation: "modal", headerShown: false }}
            />
            <Stack.Screen
              name="call"
              options={{ presentation: "modal", headerShown: false }}
            />
          </Stack>
        </GestureHandlerRootView>
      </NevkaProvider>
    </ThemeProvider>
  );
}
