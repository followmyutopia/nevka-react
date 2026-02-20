/**
 * Nevka Mobile v1.6
 * 2025 Avicus Delacroix
 */

import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, useColorScheme } from "react-native";
import { View, Text } from "@/src/components/Themed";
import { StatusBar } from "expo-status-bar";
import { useNevkaProvider } from "../providers/nevkaProvider";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import Colors from "../constants/Colors";
import { useHeaderHeight } from "@react-navigation/elements";
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function settings() {
    const { domain, token, setToken }: any = useNevkaProvider();
    if (token == "") { return <Redirect href={'/'} /> }

    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");
    const [imageStatus, setImageStatus] = useState("Можно добавить изображение");
    const colorScheme = useColorScheme();
    const headerHeight = useHeaderHeight();
    const inputStyle = colorScheme === 'light' ? styles.lightInput : styles.darkInput;
    const buttonStyle = colorScheme === 'light' ? styles.lightButton : styles.darkButton;
    const pressedColor = colorScheme === 'light' ? 'rgba(0, 0, 0, 0.11)' : 'rgba(255, 255, 255, 0.11)';
    const [image, setImage] = useState("");
    const [sending, setSending] = useState(false);

    const pickImage = async () => {
        if (!sending) {
            let result = await ImagePicker.launchImageLibraryAsync({
                base64: true
            });

            if (!result.canceled) {
                setImage('data:' + result.assets[0].mimeType + ';base64,' + result.assets[0].base64);
                setImageStatus("Выбран файл: " + result.assets[0].fileName);
                if (result.assets[0].mimeType == "image/heic") {
                    setStatus(`Формат HEIC пока что не поддерживается. Можно использовать только JPG/PNG.\n\nПопробуйте отредактировать фотографию или сделать скриншот фотографии.`);
                    setImage("");
                }
                // need to delete the file from the cache, wtf
            }
        }
    };

    const resetImage = () => {
        if (!sending) {
            setImage("");
            setImageStatus("Файл откреплён!");
            setStatus("");
        }
    };

    const postWall = async () => {
        let text = message.trim();

        if (text == "" && image == "") {
            setStatus("Пост не может быть пустым");
        }

        if (!sending && (text != "" || image != "")) {
            setSending(true);

            const formData = new FormData();
            formData.append("token", token);
            formData.append("text", text);
            formData.append("image", image);
            formData.append("api-key", "qonxod-Kicmad-4puvhy");

            try {
                const response = await fetch(domain+'/api/postWall.php', {
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
                    setMessage("");
                    setImage("");
                    setStatus("");
                    router.back();
                }
            } catch (error) {
                console.log("Ошибка публикации записи, проблемы с соединением?\n" + error);
            } finally {
                setSending(false);
            }
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <KeyboardAvoidingView style={[styles.container, { backgroundColor: colorScheme === 'light' ? Colors.light.background : Colors.dark.background }]}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={headerHeight}
            >
                <View style={{ width: '90%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 32, marginVertical: '7%', flex: 1, textAlign: 'center' }}>Написать пост</Text>
                    <Pressable
                        style={({ pressed }) => [useColorScheme() === 'light' ? styles.lightRoundButton : styles.darkRoundButton, { backgroundColor: pressed ? useColorScheme() === 'light' ? 'rgba(0, 0, 0, 0.11)' : 'rgba(255, 255, 255, 0.11)' : useColorScheme() === 'light' ? styles.lightButton.backgroundColor : styles.darkButton.backgroundColor }]}
                        onPress={() => router.back()}>
                        <FontAwesome
                            name="times"
                            size={25}
                            color={Colors[(colorScheme === 'dark' ? 'dark' : 'light')].text}
                            style={{ marginBottom: 2 }}
                        />
                    </Pressable>
                </View>
                <Text style={styles.label}>Пост:</Text>
                <TextInput
                    multiline
                    enterKeyHint='send'
                    style={inputStyle}
                    value={message}
                    onChangeText={setMessage}
                    maxLength={1023}
                    submitBehavior='submit'
                // onSubmitEditing={sendTopicReply}
                ></TextInput>
                <View style={{ flexDirection: 'row', marginHorizontal: '3%' }}>
                    {image === "" ? <Pressable style={{ justifyContent: 'center', alignItems: 'flex-start', margin: '3%' }}
                        onPress={pickImage}>
                        {({ pressed }) => (
                            <FontAwesome
                                name="picture-o"
                                size={27}
                                color={Colors[useColorScheme() ?? 'light'].text}
                                style={{ opacity: pressed ? 0.5 : 1 }}
                            />
                        )}
                    </Pressable> : <Pressable style={{ justifyContent: 'center', alignItems: 'flex-start', margin: '3%', paddingHorizontal: 1 }}
                        onPress={resetImage}>
                        {({ pressed }) => (
                            <FontAwesome
                                name="window-close-o"
                                size={27}
                                color={Colors[useColorScheme() ?? 'light'].text}
                                style={{ opacity: pressed ? 0.5 : 1 }}
                            />
                        )}
                    </Pressable>}
                    <Text style={{
                        color: colorScheme === 'light' ? 'darkslategray' : 'lightslategray',
                        fontSize: 17,
                        flex: 1,
                        justifyContent: 'center',
                        alignContent: 'center',
                        marginVertical: '5%'
                    }}>{imageStatus}</Text>
                </View>
                <Pressable
                    style={({ pressed }) => [buttonStyle, { backgroundColor: pressed ? pressedColor : buttonStyle.backgroundColor }]}
                    onPress={postWall}
                    disabled={sending}>
                    <Text style={styles.buttonText}>{sending ? 'Публикация...' : 'Опубликовать'}</Text>
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
        marginVertical: '2.5%',
        textAlign: 'center',
        width: '90%'
    },
    label: {
        fontSize: 20,
        width: '90%',
        textAlign: 'left'
    },
    darkInput: {
        width: '90%',
        height: '15%',
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
        height: '15%',
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