import { StyleSheet } from "react-native";
import { View, Text } from "@/src/components/Themed";

export default function people () {
    return (
        <View style={styles.container}>
            <Text>Люди</Text>
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