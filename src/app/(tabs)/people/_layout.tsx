/**
 * Nevka Mobile v1.4
 * 2025 Avicus Delacroix
 */

import Colors from '@/src/constants/Colors';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function MenuStack() {
    const colorScheme = useColorScheme();

    return (
        <Stack>
            <Stack.Screen name="index" options={{
                title: 'Люди',
                headerTitleAlign: 'center',
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
            <Stack.Screen name="person" options={{
                title: 'Пользователь',
                headerTitleAlign: 'center',
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