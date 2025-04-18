import { StyleSheet } from "react-native";
import { View, Text } from "@/src/components/Themed";
import { StatusBar } from "expo-status-bar";

export default function settings () {
    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Text>Настройки</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});