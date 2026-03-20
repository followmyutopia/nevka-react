/**
 * Nevka Mobile v1.8
 * 2025-2026 Avicus Delacroix
 */

import Colors from "@/src/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Stack } from "expo-router";
import { Pressable, useColorScheme } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNevkaProvider } from "@/src/providers/nevkaProvider";

export default function MenuStack() {
  const { encryptionType, setEncryptionType }: any = useNevkaProvider();
  const colorScheme = useColorScheme();

  const toggleEncryption = () => {
    if (encryptionType == "NE5") {
      setEncryptionType("");
    } else {
      setEncryptionType("NE5");
    }
  };

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Сообщения",
          headerTitleAlign: "center",
          headerRight: () => (
            <Link href="/(tabs)/people" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="plus"
                    size={25}
                    color={
                      Colors[colorScheme === "dark" ? "dark" : "light"].text
                    }
                    style={{ marginTop: 2, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerBackground: () => (
            <LinearGradient
              colors={[
                colorScheme === "light" ? Colors.light.tabs : Colors.dark.tabs,
                colorScheme === "light"
                  ? Colors.light.background
                  : Colors.dark.background,
              ]}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="chat"
        options={{
          title: "Чат",
          headerBackTitle: "Сообщения",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerBackground: () => (
            <LinearGradient
              colors={[
                colorScheme === "light" ? Colors.light.tabs : Colors.dark.tabs,
                colorScheme === "light"
                  ? Colors.light.background
                  : Colors.dark.background,
              ]}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
          ),
        }}
      />
    </Stack>
  );
}
