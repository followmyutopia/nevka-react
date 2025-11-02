/**
 * Nevka Mobile v1.5
 * 2025 Avicus Delacroix
 */

import { Button, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, useColorScheme } from "react-native";
import { View, Text } from "@/src/components/Themed";
import { StatusBar } from "expo-status-bar";
import { useNevkaProvider } from "../providers/nevkaProvider";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import Colors from "../constants/Colors";
import { useHeaderHeight } from "@react-navigation/elements";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function settings() {
    const { token, setToken }: any = useNevkaProvider();
    if (token == "") { return <Redirect href={'/'} /> }

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");
    const [sending, setSending] = useState(false);
    const colorScheme = useColorScheme();
    const headerHeight = useHeaderHeight();
    const inputStyle = colorScheme === 'light' ? styles.lightInput : styles.darkInput;
    const buttonStyle = colorScheme === 'light' ? styles.lightButton : styles.darkButton;
    const pressedColor = colorScheme === 'light' ? 'rgba(0, 0, 0, 0.11)' : 'rgba(255, 255, 255, 0.11)';

    const createTopic = async () => {
        let trimmedTitle = title.trim();
        let trimmedMessage = message.trim();

        if (trimmedTitle == "" || trimmedMessage == "") {
            setStatus("Тема и сообщение обязательны");
        }

        if (!sending && trimmedTitle != "" && trimmedMessage != "") {
            setSending(true);

            const formData = new FormData();
            formData.append("token", token);
            formData.append("title", trimmedTitle);
            formData.append("message", trimmedMessage);
            formData.append("api-key", "qonxod-Kicmad-4puvhy");

            try {
                const response = await fetch('https://nevka.site/api/createTopic.php', {
                    method: 'POST',
                    body: formData
                });
                const json = await response.json();
                if (json.result == "failure") {
                    if (json.error == "wrong_token") {
                        setToken("");
                    }
                    setStatus(json.error);
                } else if (json.result == "success") {
                    setTitle("");
                    setMessage("");
                    router.back();
                }
            } catch (error) {
                console.log("Ошибка создания темы, проблемы с соединением?\n" + error);
            } finally {
                setSending(false);
            }
        }
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView style={[styles.container, { backgroundColor: colorScheme === 'light' ? Colors.light.background : Colors.dark.background }]}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={headerHeight}
            >
                <StatusBar style="light" />
                <View style={{ width: '90%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 32, marginVertical: '7%', flex: 1, textAlign: 'center' }}>Создание темы</Text>
                    <Pressable
                        style={({ pressed }) => [useColorScheme() === 'light' ? styles.lightRoundButton : styles.darkRoundButton, { backgroundColor: pressed ? useColorScheme() === 'light' ? 'rgba(0, 0, 0, 0.11)' : 'rgba(255, 255, 255, 0.11)' : useColorScheme() === 'light' ? styles.lightButton.backgroundColor : styles.darkButton.backgroundColor }]}
                        onPress={() => router.back()}>
                        <FontAwesome
                            name="times"
                            size={25}
                            color={Colors[colorScheme ?? 'light'].text}
                            style={{ marginBottom: 2 }}
                        />
                    </Pressable>
                </View>
                <Text style={styles.label}>Тема:</Text>
                <TextInput style={inputStyle}
                    value={title}
                    onChangeText={setTitle}
                    maxLength={64}
                ></TextInput>
                <Text style={styles.label}>Сообщение:</Text>
                <TextInput
                    multiline
                    enterKeyHint='send'
                    style={[inputStyle, { height: '15%' }]}
                    value={message}
                    onChangeText={setMessage}
                    maxLength={256}
                    submitBehavior='submit'
                ></TextInput>
                <Pressable
                    style={({ pressed }) => [buttonStyle, { backgroundColor: pressed ? pressedColor : buttonStyle.backgroundColor }]}
                    onPress={createTopic}
                    disabled={sending}>
                    <Text style={styles.buttonText}>{sending ? 'Создание...' : 'Создать тему'}</Text>
                </Pressable>
                <Text style={styles.console}>{status}</Text>
            </KeyboardAvoidingView>
            <View style={{ flex: 0.25 }}></View>
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
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        padding: '3%',
        borderRadius: 25,
        margin: '2%',
        fontSize: 20,
        borderWidth: 1,
        borderColor: Colors.dark.borders,
    },
    lightInput: {
        width: '90%',
        color: Colors.light.text,
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        padding: '3%',
        borderRadius: 25,
        margin: '2%',
        fontSize: 20,
        borderWidth: 1,
        borderColor: Colors.light.borders,
    },
    darkButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        width: '90%',
        margin: '2%',
        borderRadius: 25,
        padding: '3%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.borders
    },
    lightButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        width: '90%',
        margin: '2%',
        borderRadius: 25,
        padding: '3%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.light.borders
    },
    buttonText: {
        fontSize: 20
    },
    darkRoundButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.borders
    },
    lightRoundButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.light.borders
    }
});