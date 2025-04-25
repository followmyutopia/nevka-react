import Colors from '@/src/constants/Colors';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function MenuStack() {
    const colorScheme = useColorScheme();

    return (
        <Stack>
            <Stack.Screen name="index" options={{
                title: 'Люди',
                headerStyle: {
                backgroundColor: colorScheme === 'light' ? Colors.light.tabs : Colors.dark.tabs,
                },
            }} />
            <Stack.Screen name="person" options={{
                title: 'Пользователь',
                headerStyle: {
                backgroundColor: colorScheme === 'light' ? Colors.light.tabs : Colors.dark.tabs,
                },
            }} />
        </Stack>
    );
}