import { StyleSheet } from "react-native";
import { View, Text } from "@/src/components/Themed";

export default function discussions () {
    return (
        <View style={styles.container}>
            <Text>Обсуждения</Text>
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