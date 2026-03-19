/**
 * Nevka Mobile v1.8
 * 2025-2026 Avicus Delacroix
 */

import React from "react";
import { useColorScheme } from "@/src/components/useColorScheme";
import { useNevkaProvider } from "@/src/providers/nevkaProvider";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Platform, Pressable } from "react-native";
import Colors from "@/src/constants/Colors";
import { useClientOnlyValue } from "@/src/components/useClientOnlyValue";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { messageCounter, locales }: any = useNevkaProvider();

  if (isLiquidGlassAvailable()) {
    return (
      <NativeTabs
        backgroundColor={
          colorScheme === "light" ? Colors.light.tabs : Colors.dark.tabs
        }
      >
        <NativeTabs.Trigger name="feed">
          <NativeTabs.Trigger.Icon
            sf={{ default: "newspaper", selected: "newspaper.fill" }}
            drawable="custom_home_drawable"
          />
          <NativeTabs.Trigger.Label>Лента</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="people">
          <NativeTabs.Trigger.Label>Люди</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: "person.3", selected: "person.3.fill" }}
            drawable="stat_sys_headset"
          />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="messages">
          <NativeTabs.Trigger.Label>Сообщения</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: "message", selected: "message.fill" }}
            drawable="stat_sys_warning"
          />
          {messageCounter != 0 ? (
            <NativeTabs.Trigger.Badge>
              {messageCounter}
            </NativeTabs.Trigger.Badge>
          ) : null}
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <NativeTabs.Trigger.Label>Профиль</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: "person", selected: "person.fill" }}
            drawable="stat_sys_download"
          />
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  } else {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor:
            Colors[colorScheme === "dark" ? "dark" : "light"].tint,
          headerShown: useClientOnlyValue(false, true),
          tabBarBackground: () => (
            <LinearGradient
              colors={[
                colorScheme === "light" ? Colors.light.tabs : Colors.dark.tabs,
                colorScheme === "light"
                  ? Colors.light.background
                  : Colors.dark.background,
              ]}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
              style={{ flex: 1 }}
            />
          ),
          tabBarStyle: {
            backgroundColor: "transparent",
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
        }}
      >
        <Tabs.Screen
          name="feed"
          options={{
            title: "Лента",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="id-card" color={color} />
            ),
            headerStyle: {
              backgroundColor:
                colorScheme === "light" ? Colors.light.tabs : Colors.dark.tabs,
            },
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="people"
          options={{
            title: locales.t("people"),
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="users" color={color} />
            ),
            headerStyle: {
              backgroundColor:
                colorScheme === "light" ? Colors.light.tabs : Colors.dark.tabs,
            },
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: locales.t("messages"),
            tabBarBadge: messageCounter == 0 ? null : messageCounter,
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="paper-plane" color={color} />
            ),
            headerStyle: {
              backgroundColor:
                colorScheme === "light" ? Colors.light.tabs : Colors.dark.tabs,
            },
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: locales.t("profile"),
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="user-circle-o" color={color} />
            ),
            headerStyle: {
              backgroundColor:
                colorScheme === "light" ? Colors.light.tabs : Colors.dark.tabs,
            },
            headerShown: false,
          }}
        />
      </Tabs>
    );
  }
}
