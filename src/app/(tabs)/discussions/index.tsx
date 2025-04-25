import { StyleSheet } from "react-native";
import { View, Text } from "@/src/components/Themed";
import { useNevkaProvider } from "@/src/providers/nevkaProvider";
import { Redirect } from "expo-router";

export default function discussions () {
    const { token }: any = useNevkaProvider();
    if ( token == "") { return <Redirect href={'/'} /> };

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