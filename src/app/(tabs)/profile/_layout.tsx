/**
 * Nevka Mobile v1.7
 * 2025-2026 Avicus Delacroix
 */

import Colors from '@/src/constants/Colors';
import { Link, Stack } from 'expo-router';
import { Pressable, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function MenuStack() {
    const colorScheme = useColorScheme();

    return (
        <Stack>
            <Stack.Screen name="index" options={{
                title: 'Профиль',
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: 'transparent',
                },
                // headerRight: () => (
                //     <Link href="/settings" asChild>
                //         <Pressable>
                //             {({ pressed }) => (
                //                 <FontAwesome
                //                     name="cog"
                //                     size={25}
                //                     color={Colors[(colorScheme === 'dark' ? 'dark' : 'light')].text}
                //                     style={{ marginTop: 0, marginLeft: 7.5, opacity: pressed ? 0.5 : 1 }}
                //                 />
                //             )}
                //         </Pressable>
                //     </Link>
                // ),
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