/**
 * Nevka Mobile v1.4
 * 2025 Avicus Delacroix
 */

import { StyleSheet, TextInput, useColorScheme, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Text } from "../components/Themed"
import Colors from "../constants/Colors";
import { useNevkaProvider } from "../providers/nevkaProvider";
import { Redirect } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements"
import { useState } from "react";
import { StatusBar } from "expo-status-bar";

export default function signup() {
    const colorScheme = useColorScheme();
    const headerHeight = useHeaderHeight();
    const inputStyle = colorScheme === 'light' ? styles.lightInput : styles.darkInput;
    const buttonStyle = colorScheme === 'light' ? styles.lightButton : styles.darkButton;
    const pressedColor = colorScheme === 'light' ? 'rgba(0, 0, 0, 0.11)' : 'rgba(255, 255, 255, 0.11)';
    const [emailStatus, setEmailStatus] = useState("");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [confirmationCode, setConfirmationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [codeSent, setCodeSent] = useState(false);
    const [buttonInactive, setButtonInactive] = useState(false);
    const [emailEditable, setEmailEditable] = useState(true);

    const { token }: any = useNevkaProvider();
    if (token != "") { return <Redirect href={'/(tabs)/profile'} /> }

    const sendConfirmation = async () => {
        let trimmedEmail = email.trim();

        setButtonInactive(true);
        setEmailEditable(false);
        setEmailStatus("Проверка почты, подождите...");

        const formData = new FormData();
        formData.append("email", trimmedEmail);
        formData.append("api-key", "qonxod-Kicmad-4puvhy");

        try {
            const response = await fetch('https://nevka.site/api/sendPRC.php', {
                method: 'POST',
                body: formData
            });
            const json = await response.json();
            console.log(json);
            if (json.result == "failure") {
                setEmailStatus(json.error);
                setEmailEditable(true);
            } else if (json.result == "success") {
                setCode(json.code);
                setEmailStatus("Код выслан на почту");
                setCodeSent(true);
            }
        } catch (error) {
            console.log("Ошибка отправки кода подтверждения, проблемы с соединением?\n" + error);
        } finally {
            setButtonInactive(false);
        }
    }

    const resetPassword = async () => {
        let trimmedEmail = email.trim();
        let newPass = newPassword.trim();
        let confirmPass = confirmPassword.trim();

        if (newPass != confirmPass) {
            setEmailStatus("Пароли не совпадают");
        } else if (newPass == "") {
            setEmailStatus("Пароль не может быть пустым");
        } else if (code != confirmationCode) {
            setEmailStatus("Неправильный код подтверждения");
        } else {
            setButtonInactive(true);
            setEmailStatus("Сброс пароля...");

            const formData = new FormData();
            formData.append("email", trimmedEmail);
            formData.append("password", newPass);
            formData.append("api-key", "qonxod-Kicmad-4puvhy");

            try {
                const response = await fetch('https://nevka.site/api/resetPassword.php', {
                    method: 'POST',
                    body: formData
                });
                const json = await response.json();
                if (json.result == "failure") {
                    setEmailStatus(json.error);
                } else if (json.result == "success") {
                    setEmailStatus("Пароль успешно установлен!");
                    setCodeSent(false);
                }
            } catch (error) {
                console.log("Ошибка сброса пароля, проблемы с соединением?\n" + error);
            }
        }
    }

    return (
        <KeyboardAvoidingView style={[styles.container, { backgroundColor: colorScheme === 'light' ? Colors.light.background : Colors.dark.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={headerHeight}>

            <StatusBar style="light" />
            <ScrollView style={{ width: '90%' }}>
                <Text style={{ fontSize: 32, marginVertical: '7%', textAlign: 'center' }}>Сброс пароля</Text>

                <Text style={styles.label}>Электронная почта:</Text>
                <TextInput style={inputStyle}
                    value={email}
                    onChangeText={setEmail}
                    maxLength={63}
                    spellCheck={false}
                    editable={emailEditable}
                ></TextInput>
                <Text style={styles.label}>Код подтверждения:</Text>
                <TextInput style={inputStyle}
                    value={confirmationCode}
                    onChangeText={setConfirmationCode}
                    maxLength={63}
                    spellCheck={false}
                    editable={codeSent}
                ></TextInput>
                <Text style={styles.label}>Новый пароль:</Text>
                <TextInput style={inputStyle}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    maxLength={63}
                    spellCheck={false}
                    editable={codeSent}
                    secureTextEntry={true}
                ></TextInput>
                <Text style={styles.label}>Повторите пароль:</Text>
                <TextInput style={inputStyle}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    maxLength={63}
                    spellCheck={false}
                    editable={codeSent}
                    secureTextEntry={true}
                ></TextInput>

                <Pressable
                    style={({ pressed }) => [buttonStyle, { backgroundColor: pressed ? pressedColor : buttonStyle.backgroundColor }]}
                    onPress={codeSent ? resetPassword : sendConfirmation}
                    disabled={buttonInactive}
                >
                    <Text style={styles.buttonText}>{codeSent ? "Установить пароль" : "Выслать код подтверждения"}</Text>
                </Pressable>
                <Text style={styles.console}>{emailStatus}</Text>
                <Text style={{
                    color: useColorScheme() === 'light' ? 'darkslategray' : 'lightslategray',
                    textAlign: 'center',
                    fontSize: 20,
                    marginVertical: '5%'
                }}>Обратите внимание, при сбросе пароля все текущие сессии, включая веб-версию, будут завершены.</Text>
            </ScrollView>

        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center'
    },
    label: {
        fontSize: 20,
        // width: '90%',
        textAlign: 'left'
    },
    console: {
        textAlign: 'center',
        fontSize: 20,
        color: 'orange',
        marginTop: '2.5%'
    },
    darkInput: {
        // width: '90%',
        color: Colors.dark.text,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        padding: '3%',
        borderRadius: 25,
        marginVertical: '2%',
        fontSize: 20,
        borderWidth: 1,
        borderColor: Colors.dark.borders
    },
    lightInput: {
        // width: '90%',
        color: Colors.light.text,
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        padding: '3%',
        borderRadius: 25,
        marginVertical: '2%',
        fontSize: 20,
        borderWidth: 1,
        borderColor: Colors.light.borders
    },
    darkButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        // width: '90%',
        marginVertical: '2%',
        borderRadius: 25,
        padding: '3%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.borders
    },
    lightButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        // width: '90%',
        marginVertical: '2%',
        borderRadius: 25,
        padding: '3%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.light.borders
    },
    buttonText: {
        fontSize: 20
    }
});