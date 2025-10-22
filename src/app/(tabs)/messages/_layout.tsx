/**
 * Nevka Mobile v1.2
 * 2025 Avicus Delacroix
 */

import Colors from '@/src/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Stack } from 'expo-router';
import { Pressable, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNevkaProvider } from '@/src/providers/nevkaProvider';

export default function MenuStack() {
    const { encryptionType, setEncryptionType }: any = useNevkaProvider();
    const colorScheme = useColorScheme();

    const toggleEncryption = () => {
        if (encryptionType == 'NE3') {
            setEncryptionType('');
        } else {
            setEncryptionType('NE3');
        }
    }

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
                                    style={{ marginTop: 2, marginLeft: 8, opacity: pressed ? 0.5 : 1 }}
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
                headerRight: () => (
                    <Pressable onPress={toggleEncryption}>
                        {({ pressed }) => (
                            <FontAwesome
                                name={encryptionType == "NE3" ? "lock" : "unlock-alt"}
                                size={21}
                                color={Colors[colorScheme ?? 'light'].text}
                                style={{ marginTop: 1, marginLeft: 11, opacity: pressed ? 0.5 : 1 }}
                            />
                        )}
                    </Pressable>
                ),
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