/**
 * Nevka Mobile v1.6
 * 2025 Avicus Delacroix
 */

import { createContext, PropsWithChildren, useContext, useEffect, useState, useRef } from "react";
import * as Notifications from "expo-notifications";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, StyleSheet, View } from "react-native";
import { RelativePathString, router } from "expo-router";
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import { WebView } from 'react-native-webview';

const NevkaContext = createContext({});

type PushDataObject = {
    url?: RelativePathString
};

export default function NevkaProvider({ children }: PropsWithChildren) {
    const [token, setTokenLocal] = useState<string>("");
    const [loggedUser, setLoggedUserLocal] = useState<string>("");
    const [theme, setThemeLocal] = useState<string>("");
    const [messageCounter, setMessageCounterLocal] = useState<number>(0);
    const [isNameSet, setIsNameSet] = useState<boolean>(true);
    const [pushToken, setPushTokenLocal] = useState<string>();
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
    const [encryptionType, setEncryptionTypeLocal] = useState<string>("");
    const [notificationStatus, setNotificationStatusLocal] = useState<string>("");
    const [callErrorMessage, setCallErrorMessage] = useState<string>("");
    const [callActive, setCallActive] = useState<boolean>(false);
    const [voxUsername, setVoxUsername] = useState("");
    const [voxLogged, setVoxLogged] = useState(false);
    const [latestVersion, setLatestVersion] = useState("");
    const webviewRef = useRef<WebView>(null);

    const setMessageCounter = async (value: number) => {
        setMessageCounterLocal(value);
        Notifications.setBadgeCountAsync(value);
    };

    const setPushToken = async (value: string) => {
        setPushTokenLocal(value);
        try {
            await AsyncStorage.setItem('push_token', value);
        } catch (e) {
            console.log("AsyncStorage error: " + e);
        }
    };

    const setToken = async (value: string) => {
        setTokenLocal(value);
        try {
            await AsyncStorage.setItem('token', value);
        } catch (e) {
            console.log("AsyncStorage error: " + e);
        }
    };

    const setLoggedUser = async (value: string) => {
        setLoggedUserLocal(value);
        try {
            await AsyncStorage.setItem('loggedUser', value);
        } catch (e) {
            console.log("AsyncStorage error: " + e);
        }
    };

    const setTheme = async (value: string) => {
        setThemeLocal(value);
        if (value == 'light') Appearance.setColorScheme('light');
        if (value == 'dark') Appearance.setColorScheme('dark');
        try {
            await AsyncStorage.setItem('theme', value);
        } catch (e) {
            console.log("AsyncStorage error: " + e);
        }
    };

    const setEncryptionType = async (value: string) => {
        setEncryptionTypeLocal(value);
        try {
            await AsyncStorage.setItem('encryption', value);
        } catch (e) {
            console.log("AsyncStorage error: " + e);
        }
    };

    const setNotificationStatus = async (value: string) => {
        setNotificationStatusLocal(value);
        try {
            await AsyncStorage.setItem('notificationStatus', value);
        } catch (e) {
            console.log("AsyncStorage error: " + e);
        }
    };

    const getNotificationStatus = async () => {
        try {
            const value = await AsyncStorage.getItem('notificationStatus');
            if (value !== null) {
                setNotificationStatusLocal(value);
            }
        } catch (e) {
            console.log("AsyncStorage error: " + e);
        }
    };

    const getEncryptionType = async () => {
        try {
            const value = await AsyncStorage.getItem('encryption');
            if (value !== null) {
                setEncryptionTypeLocal(value);
            }
        } catch (e) {
            console.log("AsyncStorage error: " + e);
        }
    };

    const getPushToken = async () => {
        try {
            const value = await AsyncStorage.getItem('push_token');
            if (value !== null) {
                setPushTokenLocal(value);
            }
        } catch (e) {
            console.log("AsyncStorage error: " + e);
        }
    };

    const getToken = async () => {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                setTokenLocal(value);
            }
        } catch (e) {
            console.log("AsyncStorage error: " + e);
        }
    };

    const getLoggedUser = async () => {
        try {
            const value = await AsyncStorage.getItem('loggedUser');
            if (value !== null) {
                setLoggedUserLocal(value);
            }
        } catch (e) {
            console.log("AsyncStorage error: " + e);
        }
    };

    const getTheme = async () => {
        try {
            const value = await AsyncStorage.getItem('theme');
            if (value !== null) {
                setThemeLocal(value);
                if (value == 'light') Appearance.setColorScheme('light');
                if (value == 'dark') Appearance.setColorScheme('dark');
            }
        } catch (e) {
            console.log("AsyncStorage error: " + e);
        }
    };

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });

    const locales = new I18n({
        en: {
            profile: 'Profile',
            people: 'People',
            messages: 'Messages',
            discussions: 'Discussions',
            settings: 'Settings',
            personal: 'Personal info',
            firstname: 'First name (required)',
            lastname: 'Last name (required)',
            city: 'City',
            bio: 'Bio',
            setinfo: 'Set info',
            setting: 'Setting...',
            avatar: 'Avatar',
            now: 'Now',
            willbe: 'To be set',
            choosefile: 'Choose file',
            setavatar: 'Set avatar',
            notselected: 'No file selected'
        },
        ru: {
            profile: 'Профиль',
            people: 'Люди',
            messages: 'Сообщения',
            discussions: 'Обсуждения',
            settings: 'Настройки',
            personal: 'Личная информация',
            firstname: 'Имя (обязательно)',
            lastname: 'Фамилия (обязательно)',
            city: 'Город',
            bio: 'Информация',
            setinfo: 'Установить информацию',
            setting: 'Установка...',
            avatar: 'Аватар',
            now: 'Сейчас',
            willbe: 'Будет',
            choosefile: 'Выбрать файл',
            setavatar: 'Установить аватар',
            notselected: 'Не выбрано'
        },
        sv: {
            profile: 'Profil',
            people: 'Personer',
            messages: 'Meddelanden',
            discussions: 'Diskussioner'
        },
    });

    // Set the locale once at the beginning of your app.
    // locales.locale = getLocales()[0].languageCode ?? 'ru';
    locales.locale = 'ru';

    // Encryption functions
    function mod(n: number, m: number) {
        return ((n % m) + m) % m;
    }

    function hashKey(key: string): number {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
        }
        return hash;
    }

    const VALID_RANGES: [number, number][] = [
        [0x0020, 0xD7FF],
        [0xE000, 0x10FFFF]
    ];

    const TOTAL_VALID =
        (0xD7FF - 0x0020 + 1) +
        (0x10FFFF - 0xE000 + 1);

    function codePointToIndex(cp: number): number {
        if (cp >= 0x0020 && cp <= 0xD7FF) return cp - 0x0020;
        if (cp >= 0xE000 && cp <= 0x10FFFF)
            return (0xD7FF - 0x0020 + 1) + (cp - 0xE000);

        return codePointToIndex(0xFFFD);
    }

    function indexToCodePoint(idx: number): number {
        if (idx <= 0xD7FF - 0x0020) return 0x0020 + idx;
        return 0xE000 + (idx - (0xD7FF - 0x0020 + 1));
    }

    function encode(text: string, key: string): string {
        const keyHash = hashKey(key);
        return Array.from(text)
            .map((ch, i) => {
                const cp = ch.codePointAt(0)!;
                const idx = codePointToIndex(cp);
                const newIdx = (idx + keyHash + i * 37) % TOTAL_VALID;
                return String.fromCodePoint(indexToCodePoint(newIdx));
            })
            .join("");
    }

    function* codePoints(str: string) {
        let i = 0;
        while (i < str.length) {
            const cp = str.codePointAt(i)!;
            yield cp;
            i += cp > 0xffff ? 2 : 1;
        }
    }

    function decode(encoded: string, key: string): string {
        const keyHash = hashKey(key);
        const chars: number[] = Array.from(codePoints(encoded));

        return chars
            .map((cp, i) => {
                const idx = codePointToIndex(cp);
                const origIdx = mod(idx - (keyHash + i * 37), TOTAL_VALID);
                return String.fromCodePoint(indexToCodePoint(origIdx));
            })
            .join("");
    }

    const voxLogin = (username: string) => {
        console.log("Voximplant: logging in as " + username);
        webviewRef.current?.injectJavaScript(`
            window.login('${username}'+'@nevka.avicus.n4.voximplant.com', 'tozmic-3wyXtu-sokhir');
            true;
        `);
    };

    const checkVoxUsername = async (username: string) => {
        const formData = new FormData();
        formData.append("vox_username", username);
        formData.append("api-key", "qonxod-Kicmad-4puvhy");

        try {
            const response = await fetch('https://nevka.site/api/checkVoxUsername.php', {
                method: 'POST',
                body: formData
            });
            const json = await response.json();
            if (json.result == "failure") {
                console.log("checkVoxUsername error: " + json.error)
            } else if (json.result == "success") {
                return json.id;
            }
        } catch (error) {
            console.log("Ошибка проверки пользователя Voximplant, проблемы с соединением?\n" + error);
        }
    }

    useEffect(() => {
        getToken();
        getLoggedUser();
        getTheme();
        getPushToken();
        getEncryptionType();
        getNotificationStatus();

        const notificationListener = Notifications.addNotificationReceivedListener(notif => {
            setNotification(notif);
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            const data: PushDataObject = response.notification.request.content.data;
            if (data.url) {
                router.navigate(data.url, { withAnchor: true })
            }
        });

        return () => {
            notificationListener.remove();
            responseListener.remove();
        };
    }, [])

    return (
        <NevkaContext.Provider value={{
            locales, webviewRef, callActive,
            voxLogin,
            voxUsername, setVoxUsername,
            voxLogged, setVoxLogged,
            callErrorMessage, setCallErrorMessage,
            token, setToken,
            loggedUser, setLoggedUser,
            messageCounter, setMessageCounter,
            isNameSet, setIsNameSet,
            pushToken, setPushToken,
            theme, setTheme,
            encryptionType, setEncryptionType,
            encode, decode,
            notificationStatus, setNotificationStatus,
            latestVersion, setLatestVersion
        }}>
            {children}
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 1,
                    height: 1,
                    overflow: 'hidden',
                }}>
                <WebView
                    ref={webviewRef}
                    source={{ uri: 'https://nevka.site/api/vox.html' }}
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                    }}
                    javaScriptEnabled
                    mediaPlaybackRequiresUserAction={false}
                    allowsInlineMediaPlayback
                    onMessage={(event) => {
                        try {
                            const data = JSON.parse(event.nativeEvent.data);
                            if (data.type === 'console') {
                                console.log(...data.log);
                            } else if (data.type === 'warn') {
                                console.warn(...data.log);
                            } else if (data.type === 'error') {
                                console.error(...data.log);
                            } else if (data.type === 'incomingCall') {
                                checkVoxUsername(data.username).then((id) => {
                                    router.navigate(`/call?id=${id}&direction=incoming` as any);
                                });
                            } else if (data.type === 'CallConnected') {
                                setCallActive(true);
                            } else if (data.type === 'CallError') {
                                setCallActive(false);
                                setCallErrorMessage(data.message);
                            } else if (data.type === 'SdkDisconnected' || data.type === 'ConnectionError') {
                                console.log('Voximplant: SDK disconnected');
                                setCallErrorMessage('Ошибка соединения');
                                setVoxLogged(false);
                            } else if (data.type === 'CallFailed' || data.type === 'CallDisconnected') {
                                setCallActive(false);
                                if (router.canGoBack()) router.back();
                            } else {
                                console.log('Voximplant: ', data);
                            }
                        } catch (e) {
                            console.log(event.nativeEvent.data);
                        }
                    }}
                />
            </View>
        </NevkaContext.Provider>
    );
};

export const useNevkaProvider = () => useContext(NevkaContext);