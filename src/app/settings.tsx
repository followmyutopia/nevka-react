import { Button, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, useColorScheme } from "react-native";
import { View, Text } from "@/src/components/Themed";
import { StatusBar } from "expo-status-bar";
import { useNevkaProvider } from "../providers/nevkaProvider";
import { Redirect } from "expo-router";
import Colors from "../constants/Colors";
import { useEffect, useState } from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import * as AppConfig from "../../app.json";

type UserData = {
    id: string,
    firstname: string,
    lastname: string,
    status: string,
    city: string,
    bio: string,
    timestamp: number,
    avatar: string,
    online: string
};

export default function settings () {
    const { token, setToken, loggedUser }: any = useNevkaProvider();
    if ( token == "") { return <Redirect href={'/'} /> }
    const colorScheme = useColorScheme();

    const [firstname, setFirstname] = useState("");
    const [lasttname, setLastname] = useState("");
    const [city, setCity] = useState("");
    const [bio, setBio] = useState("");
    const [infoStatus, setInfoStatus] = useState("");
    const [settingUserData, setSettingUserData] = useState(false);
    const headerHeight = useHeaderHeight();
    const inputStyle = colorScheme === 'light' ? styles.lightInput : styles.darkInput;
    const buttonStyle = colorScheme === 'light' ? styles.lightButton : styles.darkButton;
    const pressedColor = colorScheme === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)';

    const getUserData = async (id: string) => {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("token", token);

        try {
            const response = await fetch('https://nevka.site/api/getUserData.php', {
                method: 'POST',
                body: formData
            });
            const json = await response.json();
            if (json.result == "failure") {
                console.log("getUserData error: " + json.error)
            } else if (json.result == "success") {
                setFirstname(json.firstname);
                setLastname(json.lastname);
                setCity(json.city);
                setBio(json.bio);
            }
        } catch (error) {
            console.log("Ошибка запроса данных пользователя, проблемы с соединением?\n" + error);
        }
    }

    const setUserData = async () => {
        let newFirstname = firstname.trim();
        let newLastname = lasttname.trim();
        let newCity = city.trim();
        let newBio = bio.trim();

        if (newLastname == "" || newFirstname == "") {
            setInfoStatus("Имя и фамилия не могут быть пустыми");
        } else {
            const formData = new FormData();
            formData.append("token", token);
            formData.append("firstname", newFirstname);
            formData.append("lastname", newLastname);
            formData.append("city", newCity);
            formData.append("bio", newBio);

            setSettingUserData(true);

            try {
                const response = await fetch('https://nevka.site/api/setUserData.php', {
                    method: 'POST',
                    body: formData
                });
                const json = await response.json();
                if (json.result == "failure") {
                    console.log("setUserData error: " + json.error)
                } else if (json.result == "success") {
                    setInfoStatus("Успешно обновлено!");
                }
            } catch (error) {
                console.log("Ошибка записи данных пользователя, проблемы с соединением?\n" + error);
            } finally {
                setSettingUserData(false);
            }
        }
    }

    useEffect(() => {
        getUserData(loggedUser);
    }, []);
    
    return (
        <View style={styles.container}>
        <KeyboardAvoidingView style={{backgroundColor: colorScheme === 'light' ? Colors.light.background : Colors.dark.background, width: '100%'}}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={headerHeight}
            >
            <StatusBar style="light" />
            <ScrollView style={{width: '100%'}}>
                <Text style={{fontSize: 32, marginVertical: '7%', textAlign: 'center'}}>Настройки</Text>
                <Text style={{fontSize: 26, marginBottom: '4%' }}>Личная информация</Text>

                <Text style={styles.label}>Имя (обязательно):</Text>
                <TextInput style={inputStyle}
                    value={firstname}
                    onChangeText={setFirstname}
                    maxLength={63}
                    ></TextInput>
                <Text style={styles.label}>Фамилия (обязательно):</Text>
                <TextInput style={inputStyle}
                    value={lasttname}
                    onChangeText={setLastname}
                    maxLength={63}
                    ></TextInput>
                <Text style={styles.label}>Город:</Text>
                <TextInput style={inputStyle}
                    value={city}
                    onChangeText={setCity}
                    maxLength={63}
                    ></TextInput>
                <Text style={styles.label}>Информация:</Text>
                <TextInput style={inputStyle}
                    multiline
                    enterKeyHint='done'
                    submitBehavior='submit'
                    value={bio}
                    onChangeText={setBio}
                    maxLength={255}
                    ></TextInput>
                <Pressable
                    style={({pressed}) => [buttonStyle, { backgroundColor: pressed ? pressedColor : buttonStyle.backgroundColor }]}
                    onPress={setUserData}
                    disabled={settingUserData}>
                    <Text style={styles.buttonText}>{settingUserData ? 'Установка...' : 'Установить информацию'}</Text>
                </Pressable>
                <Text style={styles.console}>{infoStatus}</Text>

                <Text style={{fontSize: 26, marginVertical: '4%' }}>Аватар</Text>

                <Text style={{fontSize: 26, marginVertical: '4%' }}>Уведомления</Text>

                <Text style={{fontSize: 26, marginVertical: '4%' }}>Тема</Text>

                <Text style={{fontSize: 26, marginVertical: '4%' }}>Безопасность</Text>

                <Pressable
                    style={({pressed}) => [buttonStyle, { backgroundColor: pressed ? pressedColor : buttonStyle.backgroundColor }]}
                    onPress={() => setToken("")}>
                    <Text style={styles.buttonText}>Выйти из аккаунта</Text>
                </Pressable>

                <Text style={{fontSize: 18, alignSelf: 'center', color: colorScheme === 'light' ? 'darkslategray' : 'lightslategray'}}>Nevka Mobile v{AppConfig.expo.version}</Text>
                <Text style={{fontSize: 18, alignSelf: 'center', color: colorScheme === 'light' ? 'darkslategray' : 'lightslategray'}}>Авикус Делакруа</Text>
            </ScrollView>
        </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '3%'
    },
    console: {
        fontSize: 20,
        color: 'orange',
        textAlign: 'center'
    },
    label: {
        fontSize: 20,
        width: '90%',
        textAlign: 'left',
        marginVertical: 8
    },
    darkInput: {
        width: '100%',
        color: Colors.dark.text,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        padding: '3%',
        borderRadius: 15,
        // margin: '2%',
        fontSize: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)'
    },
    lightInput: {
        width: '100%',
        color: Colors.light.text,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        padding: '3%',
        borderRadius: 15,
        // margin: '2%',
        fontSize: 20,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.15)'
    },
    darkButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        width: '100%',
        // margin: '2%',
        marginVertical: '4%',
        borderRadius: 15,
        padding: '3%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)'
    },
    lightButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        width: '100%',
        // margin: '2%',
        marginVertical: 20,
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