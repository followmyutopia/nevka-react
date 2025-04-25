import { StyleSheet } from "react-native";
import { View, Text } from "@/src/components/Themed";
import { useNevkaProvider } from "@/src/providers/nevkaProvider";
import { Redirect, useLocalSearchParams } from "expo-router";

export default function person () {
    const { token }: any = useNevkaProvider();
    if ( token == "") { return <Redirect href={'/'} /> };
    const { id } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <Text>Люди: {id}</Text>
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