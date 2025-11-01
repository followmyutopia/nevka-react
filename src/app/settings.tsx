/**
 * Nevka Mobile v1.4
 * 2025 Avicus Delacroix
 */

import { KeyboardAvoidingView, Platform, Pressable, Image, ScrollView, StyleSheet, TextInput, useColorScheme, Switch, Linking } from "react-native";
import { View, Text } from "@/src/components/Themed";
import { StatusBar } from "expo-status-bar";
import { useNevkaProvider } from "../providers/nevkaProvider";
import { Redirect, router } from "expo-router";
import Colors from "../constants/Colors";
import { useEffect, useState } from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import * as AppConfig from "../../app.json";
import { registerForNotifications } from "../providers/expoNotifications";
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from "@expo/vector-icons/FontAwesome";

type UserData = {
    id: string,
    firstname: string,
    lastname: string,
    status: string,
    city: string,
    bio: string,
    timestamp: number,
    avatar: string,
    online: string,
    push_token: string
};

export default function settings() {
    const { token, setToken, loggedUser, pushToken, setPushToken, setTheme, locales, encryptionType, setEncryptionType, setIsNameSet }: any = useNevkaProvider();
    if (token == "") { return <Redirect href={'/'} /> }
    const colorScheme = useColorScheme();

    const [firstname, setFirstname] = useState("");
    const [lasttname, setLastname] = useState("");
    const [city, setCity] = useState("");
    const [bio, setBio] = useState("");
    const [infoStatus, setInfoStatus] = useState("");
    const [avatarStatus, setAvatarStatus] = useState("");
    const [passwordStatus, setPasswordStatus] = useState("");
    const [settingUserData, setSettingUserData] = useState(false);
    const [settingAvatar, setSettingAvatar] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [image, setImage] = useState("");
    const [currentAvatar, setCurrentAvatar] = useState("");
    const [latestVersion, setLatestVersion] = useState("");
    const [expoGoLink, setExpoGoLink] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const headerHeight = useHeaderHeight();
    const inputStyle = colorScheme === 'light' ? styles.lightInput : styles.darkInput;
    const buttonStyle = colorScheme === 'light' ? styles.lightButton : styles.darkButton;
    const pressedColor = colorScheme === 'light' ? 'rgba(0, 0, 0, 0.11)' : 'rgba(255, 255, 255, 0.11)';

    const [themeSwitch, setThemeSwitch] = useState(false);
    const [notificationSwitch, setNotificationSwitch] = useState(false);
    const [encryptionSwitch, setEncryptionSwitch] = useState(false);

    const toggleTheme = () => {
        if (themeSwitch) {
            setTheme('light');
            setThemeSwitch(false);
        } else {
            setTheme('dark');
            setThemeSwitch(true);
        }
    }

    const toggleEncryption = () => {
        if (encryptionSwitch) {
            setEncryptionType('');
            setEncryptionSwitch(false);
        } else {
            setEncryptionType('NE3');
            setEncryptionSwitch(true);
        }
    }

    const checkEncryptionState = () => {
        console.log("Encryption: " + encryptionType)
        if (encryptionType == "NE3") setEncryptionSwitch(true);
        else setEncryptionSwitch(false);
    }

    const toggleNotifications = () => {
        if (notificationSwitch) {
            savePushToken("null");
        } else {
            registerForNotifications()
                .then(async result => {
                    setPushToken(result ?? '');
                }).then(() => {
                    savePushToken(pushToken);
                })
                .catch((error: any) => console.log(`${error}`));
        }
    }

    const getUserData = async (id: string) => {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("token", token);
        formData.append("api-key", "qonxod-Kicmad-4puvhy");

        try {
            const response = await fetch('https://nevka.site/api/getUserData.php', {
                method: 'POST',
                body: formData
            });
            const json = await response.json();
            if (json.result == "failure") {
                if (json.error == "wrong_token") {
                    setToken("");
                }
                console.log("getUserData error: " + json.error)
            } else if (json.result == "success") {
                setFirstname(json.firstname);
                setLastname(json.lastname);
                setCity(json.city);
                setBio(json.bio);
                setCurrentAvatar(json.avatar);

                if (pushToken == json.push_token) setNotificationSwitch(true);
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
            formData.append("api-key", "qonxod-Kicmad-4puvhy");

            setSettingUserData(true);

            try {
                const response = await fetch('https://nevka.site/api/setUserData.php', {
                    method: 'POST',
                    body: formData
                });
                const json = await response.json();
                if (json.result == "failure") {
                    if (json.error == "wrong_token") {
                        setToken("");
                    }
                    console.log("setUserData error: " + json.error)
                } else if (json.result == "success") {
                    setIsNameSet(true);
                    setInfoStatus("Успешно обновлено!");
                }
            } catch (error) {
                console.log("Ошибка записи данных пользователя, проблемы с соединением?\n" + error);
            } finally {
                setSettingUserData(false);
            }
        }
    }

    const savePushToken = async (value: string) => {
        if (pushToken != undefined && value != "") {
            const formData = new FormData();
            formData.append("token", token);
            formData.append("push_token", value);
            formData.append("api-key", "qonxod-Kicmad-4puvhy");

            try {
                const response = await fetch('https://nevka.site/api/setPushToken.php', {
                    method: 'POST',
                    body: formData
                });
                const json = await response.json();
                if (json.result == "failure") {
                    if (json.error == "wrong_token") {
                        setToken("");
                    }
                    console.log("setPushToken error: " + json.error)
                } else if (json.result == "success") {
                    if (value === "null") {
                        setNotificationSwitch(false);
                    } else {
                        setNotificationSwitch(true);
                    }
                }
            } catch (error) {
                console.log("Ошибка записи push-токена, проблемы с соединением?\n" + error);
            }
        }
    }

    const pickImage = async () => {
        if (!settingAvatar) {
            let result = await ImagePicker.launchImageLibraryAsync({
                base64: true,
                allowsEditing: true,
                aspect: [1, 1]
            });

            if (!result.canceled) {
                setImage('data:' + result.assets[0].mimeType + ';base64,' + result.assets[0].base64);
                // need to delete the file from the cache, wtf
            }
        }
    };

    const setAvatar = async () => {
        if (image == "") {
            setAvatarStatus("Файл не выбран!")
        } else {
            setSettingAvatar(true);

            const formData = new FormData();
            formData.append("token", token);
            formData.append("avatar", image);
            formData.append("api-key", "qonxod-Kicmad-4puvhy");

            try {
                const response = await fetch('https://nevka.site/api/setAvatar.php', {
                    method: 'POST',
                    body: formData
                });
                const json = await response.json();
                if (json.result == "failure") {
                    if (json.error == "wrong_token") {
                        setToken("");
                    }
                    console.log("setUserData error: " + json.error)
                } else if (json.result == "success") {
                    setImage("");
                    setAvatarStatus("Аватар успешно загружен");
                    getUserData(loggedUser);
                }
            } catch (error) {
                console.log("Ошибка установки аватара, проблемы с соединением?\n" + error);
            } finally {
                setSettingAvatar(false);
            }
        }
    }

    const changePassword = async () => {
        let oldPass = oldPassword.trim();
        let newPass = newPassword.trim();
        let confirmPass = confirmPassword.trim();

        if (newPass != confirmPass) {
            setPasswordStatus("Пароли не совпадают");
        } else if (newPass == "" || oldPass == "") {
            setPasswordStatus("Пароль не может быть пустым");
        } else {
            setChangingPassword(true);

            const formData = new FormData();
            formData.append("token", token);
            formData.append("id", loggedUser);
            formData.append("old_password", oldPass);
            formData.append("new_password", newPass);
            formData.append("api-key", "qonxod-Kicmad-4puvhy");

            setSettingUserData(true);

            try {
                const response = await fetch('https://nevka.site/api/changePassword.php', {
                    method: 'POST',
                    body: formData
                });
                const json = await response.json();
                if (json.result == "failure") {
                    if (json.error == "wrong_token") {
                        setToken("");
                    }
                    setPasswordStatus(json.error);
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                } else if (json.result == "success") {
                    setToken(json.newToken);
                    setPasswordStatus("Пароль обновлён!");
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                }
            } catch (error) {
                console.log("Ошибка смены пароля, проблемы с соединением?\n" + error);
            } finally {
                setChangingPassword(false);
            }
        }
    }

    const checkUpdate = async () => {
        try {
            const response = await fetch('https://nevka.site/api/checkUpdate.php');
            const json = await response.json();
            setLatestVersion(json.latestVersion);
            setExpoGoLink(json.expoGo);
        } catch (error) {
            console.log("Ошибка запроса последней версии, проблемы с соединением?\n" + error);
        }
    }

    const getNewVersion = () => {
        const url = Platform.OS === 'ios' ? expoGoLink : 'https://nevka.site/android';
        Linking.openURL(url);
    }

    useEffect(() => {
        getUserData(loggedUser);
        checkUpdate();
        checkEncryptionState();

        if (colorScheme === 'dark') setThemeSwitch(true);
    }, [pushToken]);

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView style={{ backgroundColor: colorScheme === 'light' ? Colors.light.background : Colors.dark.background, width: '100%' }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={headerHeight}
            >
                <StatusBar style="light" />
                <ScrollView style={{ width: '100%' }}>
                    <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 32, marginVertical: '7%', textAlign: 'center', flex: 1 }}>{locales.t('settings')}</Text>
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
                    <Text style={{ fontSize: 26, marginBottom: '5%' }}>{locales.t('personal')}</Text>

                    <Text style={styles.label}>{locales.t('firstname')}:</Text>
                    <TextInput style={inputStyle}
                        value={firstname}
                        onChangeText={setFirstname}
                        maxLength={63}
                    ></TextInput>
                    <Text style={styles.label}>{locales.t('lastname')}:</Text>
                    <TextInput style={inputStyle}
                        value={lasttname}
                        onChangeText={setLastname}
                        maxLength={63}
                    ></TextInput>
                    <Text style={styles.label}>{locales.t('city')}:</Text>
                    <TextInput style={inputStyle}
                        value={city}
                        onChangeText={setCity}
                        maxLength={63}
                    ></TextInput>
                    <Text style={styles.label}>{locales.t('bio')}:</Text>
                    <TextInput style={inputStyle}
                        multiline
                        enterKeyHint='done'
                        submitBehavior='submit'
                        value={bio}
                        onChangeText={setBio}
                        maxLength={255}
                    ></TextInput>
                    <Pressable
                        style={({ pressed }) => [buttonStyle, { backgroundColor: pressed ? pressedColor : buttonStyle.backgroundColor }]}
                        onPress={setUserData}
                        disabled={settingUserData}>
                        <Text style={styles.buttonText}>{settingUserData ? locales.t('setting') : locales.t('setinfo')}</Text>
                    </Pressable>
                    <Text style={styles.console}>{infoStatus}</Text>

                    <Text style={{ fontSize: 26, marginVertical: '5%' }}>{locales.t('avatar')}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 10 }}>
                        <Text style={{ width: '40%', fontSize: 22, textAlign: 'center' }}>{locales.t('now')}:</Text>
                        <Text style={{ width: '40%', fontSize: 22, textAlign: 'center' }}>{locales.t('willbe')}:</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        {currentAvatar == "" ? <Text style={{
                            width: '40%',
                            fontSize: 20,
                            alignSelf: 'center',
                            textAlign: 'center'
                        }}>Загрузка...</Text> : <Image style={{
                            width: '40%',
                            aspectRatio: 1,
                            borderRadius: 25,
                            borderWidth: 1,
                            borderColor: colorScheme === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.04)'
                        }}
                            source={{ uri: currentAvatar }}
                        ></Image>}
                        {image == "" ? <Text style={{
                            width: '40%',
                            fontSize: 20,
                            alignSelf: 'center',
                            textAlign: 'center'
                        }}>{locales.t('notselected')}</Text> : <Image style={{
                            width: '40%',
                            aspectRatio: 1,
                            borderRadius: 25,
                            borderWidth: 1,
                            borderColor: colorScheme === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.04)'
                        }}
                            source={{ uri: image }}
                        ></Image>}
                    </View>
                    <Pressable
                        style={({ pressed }) => [buttonStyle, { backgroundColor: pressed ? pressedColor : buttonStyle.backgroundColor }]}
                        onPress={image == "" ? pickImage : setAvatar}
                        disabled={settingAvatar}>
                        <Text style={styles.buttonText}>{image == "" ? locales.t('choosefile') : settingAvatar ? locales.t('setting') : locales.t('setavatar')}</Text>
                    </Pressable>
                    <Text style={styles.console}>{avatarStatus}</Text>

                    <Text style={{ fontSize: 26, marginVertical: '5%' }}>Приложение</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <Text style={{ fontSize: 20 }}>Push-уведомления</Text>
                        <Switch value={notificationSwitch} onValueChange={toggleNotifications} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <Text style={{ fontSize: 20 }}>Тёмная тема</Text>
                        <Switch value={themeSwitch} onValueChange={toggleTheme} />
                    </View>

                    <Text style={{ fontSize: 26, marginVertical: '5%' }}>Безопасность</Text>
                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <Text style={{ fontSize: 20 }}>Шифрование сообщений</Text>
                        <Switch value={encryptionSwitch} onValueChange={toggleEncryption} />
                    </View>
                    <Text style={{ fontSize: 16, textAlign: 'center', marginHorizontal: 10, marginVertical: -5 }}>Внимание! При включенном шифровании, сообщения шифруются на вашем устройстве при отправке, и их невозможно будет прочитать с веб-версии.</Text> */}
                    {/* <Text style={{ fontSize: 24, marginTop: '5%', marginBottom: '2%' }}>Смена пароля</Text> */}
                    <Text style={styles.label}>Старый пароль:</Text>
                    <TextInput style={inputStyle}
                        value={oldPassword}
                        onChangeText={setOldPassword}
                        maxLength={63}
                        secureTextEntry={true}
                    ></TextInput>
                    <Text style={styles.label}>Новый пароль:</Text>
                    <TextInput style={inputStyle}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        maxLength={63}
                        secureTextEntry={true}
                    ></TextInput>
                    <Text style={styles.label}>Повторите новый пароль:</Text>
                    <TextInput style={inputStyle}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        maxLength={63}
                        secureTextEntry={true}
                    ></TextInput>
                    <Pressable
                        style={({ pressed }) => [buttonStyle, { backgroundColor: pressed ? pressedColor : buttonStyle.backgroundColor }]}
                        onPress={changePassword}>
                        <Text style={styles.buttonText}>{changingPassword ? "Подождите..." : "Сменить пароль"}</Text>
                    </Pressable>
                    <Text style={styles.console}>{passwordStatus}</Text>

                    <Pressable
                        style={({ pressed }) => [buttonStyle, { backgroundColor: pressed ? pressedColor : buttonStyle.backgroundColor }]}
                        onPress={() => setToken("")}>
                        <Text style={styles.buttonText}>Выйти из аккаунта</Text>
                    </Pressable>

                    <Text style={{ fontSize: 18, alignSelf: 'center', color: colorScheme === 'light' ? 'darkslategray' : 'lightslategray' }}>Nevka Mobile v{AppConfig.expo.version}</Text>
                    <Text style={{ fontSize: 18, alignSelf: 'center', color: colorScheme === 'light' ? 'darkslategray' : 'lightslategray' }}>Авикус Делакруа</Text>

                    {latestVersion != "" ? <Text style={{ fontSize: 15, marginTop: 16, marginBottom: 48, alignSelf: 'center', color: colorScheme === 'light' ? 'darkslategray' : 'lightslategray', textAlign: 'center' }} onPress={getNewVersion}>{latestVersion == AppConfig.expo.version ? "(актуальная версия)" : `(доступна версия v${latestVersion})\nНажмите здесь, чтобы обновить`}</Text> : null}
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
        textAlign: 'left',
        marginVertical: 8
    },
    text: {
        fontSize: 20,
        marginHorizontal: 15,
        textAlign: 'center',
        marginVertical: 8
    },
    darkInput: {
        width: '100%',
        color: Colors.dark.text,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        padding: '3%',
        borderRadius: 25,
        fontSize: 20,
        borderWidth: 1,
        borderColor: Colors.dark.borders
    },
    lightInput: {
        width: '100%',
        color: Colors.light.text,
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        padding: '3%',
        borderRadius: 25,
        fontSize: 20,
        borderWidth: 1,
        borderColor: Colors.light.borders
    },
    darkButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        width: '100%',
        marginVertical: '4%',
        borderRadius: 25,
        padding: '3%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.borders
    },
    lightButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        width: '100%',
        marginVertical: '4%',
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