import { StyleSheet, TextInput, useColorScheme } from "react-native";
import { View, Text } from "@/src/components/Themed";
import { useNevkaProvider } from "@/src/providers/nevkaProvider";
import { Redirect } from "expo-router";
import { useState } from "react";
import Colors from "@/src/constants/Colors";

export default function people () {
    const { token, loggedUser }: any = useNevkaProvider();
    if ( token == "") { return <Redirect href={'/'} /> };

    const colorScheme = useColorScheme();
    const [ query, setQuery ] = useState("");
    const inputStyle = colorScheme === 'light' ? styles.lightInput : styles.darkInput;
    
    return (
        <View style={styles.container}>
            <TextInput style={inputStyle}
                value={query}
                onChangeText={setQuery}
                maxLength={63}
                spellCheck={false}
                ></TextInput>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    darkInput: {
            width: '94%',
            color: Colors.dark.text,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            padding: '3%',
            borderRadius: 15,
            margin: '3%',
            fontSize: 20,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.15)'
        },
        lightInput: {
            width: '94%',
            color: Colors.light.text,
            backgroundColor: 'rgba(0, 0, 0, 0.15)',
            padding: '3%',
            borderRadius: 15,
            margin: '3%',
            fontSize: 20,
            borderWidth: 1,
            borderColor: 'rgba(0, 0, 0, 0.15)'
        },
});