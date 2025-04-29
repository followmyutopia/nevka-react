import { StyleSheet, TextInput, useColorScheme, Pressable, KeyboardAvoidingView, Platform, Button } from "react-native";
import { Text } from "../components/Themed"
import Colors from "../constants/Colors";
import { Redirect, router } from "expo-router";
import { useNevkaProvider } from "../providers/nevkaProvider";
import { useEffect, useState } from "react";
import { useHeaderHeight } from "@react-navigation/elements"

export default function index () {
    const { token, setToken, loggedUser, setLoggedUser }: any = useNevkaProvider();
    if ( token != "") { return <Redirect href={'/(tabs)/profile'} /> }

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [consoleMessage, setConsoleMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [session, setSession] = useState("");
    const headerHeight = useHeaderHeight();

    const colorScheme = useColorScheme();
    const inputStyle = colorScheme === 'light' ? styles.lightInput : styles.darkInput;
    const buttonStyle = colorScheme === 'light' ? styles.lightButton : styles.darkButton;
    const pressedColor = colorScheme === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)';

    const isValidEmail = () => {
        const atLocation = login.lastIndexOf("@");
        const dotLocation = login.lastIndexOf("."); 
        return (
            atLocation > 0 &&
            dotLocation > atLocation + 1 &&
            dotLocation < login.length - 1
        );
    };

    const signIn = async () => {
        if (isValidEmail()) {
            setLoading(true);

            const formData = new FormData();
            formData.append("login", login);
            formData.append("password", password);

            try {
                const response = await fetch('https://nevka.site/api/login.php', {
                    method: 'POST',
                    body: formData
                });
                const json = await response.json();
                if (json.result == "failure") {
                    setConsoleMessage(json.error)
                } else if (json.result == "success") {
                    setToken(json.token);
                    setLoggedUser(json.userId);
                }
            } catch (error) {
                setConsoleMessage("Проблемы с интернетом")
            }

            setLoading(false);
        } else {
            setConsoleMessage("Введите электронную почту")
        }
    };

    useEffect(() => {
        setLogin("avicus@ya.ru");
        setPassword("Adel1509");
    }, []);

    return (
        <KeyboardAvoidingView style={[styles.container, {backgroundColor: colorScheme === 'light' ? Colors.light.background : Colors.dark.background}]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={headerHeight}>
            <Text style={styles.logo}>Невка</Text>

            <Text style={styles.label}>Логин:</Text>
            <TextInput style={inputStyle}
                value={login}
                onChangeText={setLogin}
                maxLength={63}
                spellCheck={false}
                ></TextInput>

            <Text style={styles.label}>Пароль:</Text>
            <TextInput style={inputStyle}
                value={password}
                onChangeText={setPassword}
                maxLength={63}
                secureTextEntry={true}
                ></TextInput>

            <Pressable
                style={({pressed}) => [buttonStyle, { backgroundColor: pressed ? pressedColor : buttonStyle.backgroundColor }]}
                onPress={signIn}
                disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Выполняется вход...' : 'Войти'}</Text>
            </Pressable>

            <Pressable
                style={({pressed}) => [buttonStyle, { backgroundColor: pressed ? pressedColor : buttonStyle.backgroundColor }]}
                onPress={() => {router.navigate('/signup')}}>
                <Text style={styles.buttonText}>Зарегистрироваться</Text>
            </Pressable>

            <Text style={styles.console}>{consoleMessage}</Text>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        fontSize: 40,
        color: 'rgb(70, 150, 185)',
        margin: '7.5%'
    },
    label: {
        fontSize: 20,
        width: '90%',
        textAlign: 'left'
    },
    console: {
        fontSize: 20,
        color: 'orange',
        marginTop: '2.5%',
        textAlign: 'center'
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
        borderColor: 'rgba(255, 255, 255, 0.15)'
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
        borderColor: 'rgba(0, 0, 0, 0.15)'
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