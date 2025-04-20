import { Button, StyleSheet } from "react-native";
import { View, Text } from "@/src/components/Themed";
import { useState } from "react";
import { useNevkaProvider } from "@/src/providers/nevkaProvider";
import { Redirect } from "expo-router";

export default function profile () {
    const { token, loggedUser }: any = useNevkaProvider();
    if ( token == "") { return <Redirect href={'/'} /> }

    return (
        <View style={styles.container}>
            <Text>{loggedUser}</Text>
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