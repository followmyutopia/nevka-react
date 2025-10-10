/**
 * Nevka Mobile v1.2
 * 2025 Avicus Delacroix
 */

import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import Colors from '@/src/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useClientOnlyValue } from '@/src/components/useClientOnlyValue';
import { useNevkaProvider } from '@/src/providers/nevkaProvider';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { messageCounter, locales }: any = useNevkaProvider();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="profile"
        options={{
          title: locales.t('profile'),
          tabBarIcon: ({ color }) => <TabBarIcon name="user-circle-o" color={color} />,
          headerRight: () => (
            <Link href="/settings" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="cog"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
          headerStyle: {
            backgroundColor: colorScheme === 'light' ? Colors.light.tabs : Colors.dark.tabs,
          },
          tabBarStyle: {
            backgroundColor: colorScheme === 'light' ? Colors.light.tabs : Colors.dark.tabs,
          }
        }}
      />
      <Tabs.Screen
        name="people"
        options={{
          title: locales.t('people'),
          tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
          headerStyle: {
            backgroundColor: colorScheme === 'light' ? Colors.light.tabs : Colors.dark.tabs,
          },
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colorScheme === 'light' ? Colors.light.tabs : Colors.dark.tabs,
          }
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: locales.t('messages'),
          tabBarBadge: messageCounter == 0 ? null : messageCounter,
          tabBarIcon: ({ color }) => <TabBarIcon name="paper-plane" color={color} />,
          headerStyle: {
            backgroundColor: colorScheme === 'light' ? Colors.light.tabs : Colors.dark.tabs,
          },
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colorScheme === 'light' ? Colors.light.tabs : Colors.dark.tabs,
          }
        }}
      />
      <Tabs.Screen
        name="discussions"
        options={{
          title: locales.t('discussions'),
          tabBarIcon: ({ color }) => <TabBarIcon name="comments" color={color} />,
          headerStyle: {
            backgroundColor: colorScheme === 'light' ? Colors.light.tabs : Colors.dark.tabs,
          },
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colorScheme === 'light' ? Colors.light.tabs : Colors.dark.tabs,
          }
        }}
      />
    </Tabs>
  );
}
