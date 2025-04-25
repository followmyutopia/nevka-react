import Colors from '@/src/constants/Colors';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function MenuStack() {
    const colorScheme = useColorScheme();

    return (
        <Stack>
            <Stack.Screen name="index" options={{
                title: 'Сообщения',
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