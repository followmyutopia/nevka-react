/**
 * Nevka Mobile v1.2
 * 2025 Avicus Delacroix
 */

import Colors from '@/src/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Stack } from 'expo-router';
import { Pressable, useColorScheme } from 'react-native';

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
                backgroundColor: colorScheme === 'light' ? Colors.light.tabs : Colors.dark.tabs,
                },
            }} />
            <Stack.Screen name="chat" options={{
                title: 'Чат',
                headerBackTitle: 'Сообщения',
                headerStyle: {
                backgroundColor: colorScheme === 'light' ? Colors.light.tabs : Colors.dark.tabs,
                },
            }} />
        </Stack>
    );
}