import { Button, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, useColorScheme } from "react-native";
import { View, Text } from "@/src/components/Themed";
import { StatusBar } from "expo-status-bar";
import { useNevkaProvider } from "../providers/nevkaProvider";
import { Redirect } from "expo-router";
import { useState } from "react";
import Colors from "../constants/Colors";
import { useHeaderHeight } from "@react-navigation/elements"

export default function settings () {
    const { token, setToken }: any = useNevkaProvider();
    if ( token == "") { return <Redirect href={'/'} /> }

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("123");
    const colorScheme = useColorScheme();
    const headerHeight = useHeaderHeight();
    const inputStyle = colorScheme === 'light' ? styles.lightInput : styles.darkInput;
    const buttonStyle = colorScheme === 'light' ? styles.lightButton : styles.darkButton;
    const pressedColor = colorScheme === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)';
    
    return (
        <View style={styles.container}>
            <KeyboardAvoidingView style={[styles.container, {backgroundColor: colorScheme === 'light' ? Colors.light.background : Colors.dark.background}]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={headerHeight}
            >
                <StatusBar style="light" />
                <Text style={{fontSize: 32, marginVertical: '7%'}}>Создание темы</Text>
                <Text style={styles.label}>Тема:</Text>
                <TextInput style={inputStyle}
                    value={title}
                    onChangeText={setTitle}
                    maxLength={127}
                    // spellCheck={false}
                    ></TextInput>
                <Text style={styles.label}>Сообщение:</Text>
                <TextInput
                    multiline
                    enterKeyHint='send'
                    style={[inputStyle, {height: '15%'}]}
                    value={message}
                    onChangeText={setMessage}
                    maxLength={1023}
                    submitBehavior='submit'
                    // onSubmitEditing={sendTopicReply}
                ></TextInput>
                <Pressable
                    style={({pressed}) => [buttonStyle, { backgroundColor: pressed ? pressedColor : buttonStyle.backgroundColor }]}
                    // onPress={signIn}
                    disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Создание...' : 'Создать тему'}</Text>
                </Pressable>
                <Text style={styles.console}>{status}</Text>
            </KeyboardAvoidingView>
            <View style={{flex: 0.25}}></View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    console: {
        fontSize: 20,
        color: 'orange',
        marginTop: '2.5%',
        marginBottom: '12.5%',
        textAlign: 'center'
    },
    label: {
        fontSize: 20,
        width: '90%',
        textAlign: 'left'
    },
    darkInput: {
        width: '90%',
        color: Colors.dark.text,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        padding: '3%',
        borderRadius: 15,
        margin: '2%',
        fontSize: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    lightInput: {
        width: '90%',
        color: Colors.light.text,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        padding: '3%',
        borderRadius: 15,
        margin: '2%',
        fontSize: 20,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.15)',
    },
    darkButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        width: '90%',
        margin: '2%',
        borderRadius: 15,
        padding: '3%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)'
    },
    lightButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        width: '90%',
        margin: '2%',
        borderRadius: 15,
        padding: '3%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.15)'
    },
    buttonText: {
        fontSize: 20
    }
});