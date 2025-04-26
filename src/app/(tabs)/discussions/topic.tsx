import { StyleSheet } from "react-native";
import { View, Text } from "@/src/components/Themed";
import { useNevkaProvider } from "@/src/providers/nevkaProvider";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";

export default function topic () {
    const { token }: any = useNevkaProvider();
    if ( token == "") { return <Redirect href={'/'} /> };
    const { id } = useLocalSearchParams();

    const isFocused = useIsFocused();
    const [update, setUpdate] = useState(0);

    useEffect(() => {
        console.log("Focused topic: " + isFocused);
        if (isFocused) {
            setTimeout(() => setUpdate(update+1), 10000);
            // getMessages(token, id);
            // console.log("Updated: Messages with ID: " + id);
        }
    }, [update, isFocused]);
    
    return (
        <View style={styles.container}>
            <Text>Обсуждения: {id}</Text>
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