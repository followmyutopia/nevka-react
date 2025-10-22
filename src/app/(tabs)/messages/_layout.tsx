/**
 * Nevka Mobile v1.2
 * 2025 Avicus Delacroix
 */

import Colors from '@/src/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Stack } from 'expo-router';
import { Pressable, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function MenuStack() {
    const colorScheme = useColorScheme();

    return (
        <Stack>
            <Stack.Screen name="index" options={{
                title: 'Сообщения',
                headerRight: () => (
                    <Link href="/(tabs)/people" asChild>
                      <Pressable>
                        {({ pressed }) => (
                          <FontAwesome
                            name="plus"
                            size={25}
                            color={Colors[colorScheme ?? 'light'].text}
                            style={{ marginTop: 2, marginLeft: 7.5, opacity: pressed ? 0.5 : 1 }}
                          />
                        )}
                      </Pressable>
                    </Link>
                ),
                headerStyle: {
                                    backgroundColor: 'transparent',
                                },
                                headerBackground: () => (
                                    <LinearGradient
                                        colors={[colorScheme === 'light' ? Colors.light.tabs : Colors.dark.tabs,
                                            colorScheme === 'light' ? Colors.light.background : Colors.dark.background]}
                                        style={{ flex: 1 }}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                    />
                                )
            }} />
            <Stack.Screen name="chat" options={{
                title: 'Чат',
                headerBackTitle: 'Сообщения',
                headerStyle: {
                                    backgroundColor: 'transparent',
                                },
                                headerBackground: () => (
                                    <LinearGradient
                                        colors={[colorScheme === 'light' ? Colors.light.tabs : Colors.dark.tabs,
                                            colorScheme === 'light' ? Colors.light.background : Colors.dark.background]}
                                        style={{ flex: 1 }}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                    />
                                )
            }} />
        </Stack>
    );
}