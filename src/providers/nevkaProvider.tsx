/**
 * Nevka Mobile v1.4
 * 2025 Avicus Delacroix
 */

import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from "react-native";
import { RelativePathString, router } from "expo-router";
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

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

    // Helper: true modulo
    function mod(n: number, m: number) {
        return ((n % m) + m) % m;
    }

    // Helper: hash the key to a number
    function hashKey(key: string): number {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
        }
        return hash;
    }

    // Define valid Unicode ranges (skip surrogates and control chars)
    const VALID_RANGES: [number, number][] = [
        [0x0020, 0xD7FF],   // BMP printable excluding surrogates and control chars
        [0xE000, 0x10FFFF]  // Supplementary planes
    ];

    // Total number of valid code points
    const TOTAL_VALID = (0xD7FF - 0x0020 + 1) + (0x10FFFF - 0xE000 + 1);

    // Map code point to index in valid set
    function codePointToIndex(cp: number): number {
        if (cp >= 0x0020 && cp <= 0xD7FF) return cp - 0x0020;
        if (cp >= 0xE000 && cp <= 0x10FFFF) return (0xD7FF - 0x0020 + 1) + (cp - 0xE000);
        throw new Error(`Invalid code point: ${cp}`);
    }

    // Map index back to code point
    function indexToCodePoint(idx: number): number {
        if (idx <= 0xD7FF - 0x0020) return 0x0020 + idx;
        return 0xE000 + (idx - (0xD7FF - 0x0020 + 1));
    }

    // Encode string with key
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

    // Decode string with key
    function decode(text: string, key: string): string {
        const keyHash = hashKey(key);
        return Array.from(text)
            .map((ch, i) => {
                const cp = ch.codePointAt(0)!;
                const idx = codePointToIndex(cp);
                const origIdx = mod(idx - (keyHash + i * 37), TOTAL_VALID);
                return String.fromCodePoint(indexToCodePoint(origIdx));
            })
            .join("");
    }

    useEffect(() => {
        getToken();
        getLoggedUser();
        getTheme();
        getPushToken();
        getEncryptionType();
        getNotificationStatus();

        // let test1 = "😎🎉🚀"; let test2 = encode(test1, "SecretKey"); let test3 = decode(test2, "SecretKey"); console.log("Original " + test1); console.log("Encoded: " + test2); console.log("Decoded: " + test3);

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
            locales,
            token, setToken,
            loggedUser, setLoggedUser,
            messageCounter, setMessageCounter,
            isNameSet, setIsNameSet,
            pushToken, setPushToken,
            theme, setTheme,
            encryptionType, setEncryptionType,
            encode, decode,
            notificationStatus, setNotificationStatus
        }}>
            {children}
        </NevkaContext.Provider>
    );
};

export const useNevkaProvider = () => useContext(NevkaContext);