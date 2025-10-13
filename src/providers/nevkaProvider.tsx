/**
 * Nevka Mobile v1.2
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
    const [isNameSet, setIsNameSet] = useState<boolean>(false);
    const [pushToken, setPushTokenLocal] = useState<string>();
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
    const [encryptionType, setEncryptionTypeLocal] = useState<string>("");

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

    function buildAlphabet(): string[] {
        const chars: string[] = [];
        for (let i = 0x20; i <= 0x10FFFF; i++) {
            if (
                i === 0x22 ||  // "
                i === 0x5C ||  // \
                i === 0x2028 || // line separator
                i === 0x2029   // paragraph separator
            ) continue;
            try {
                chars.push(String.fromCodePoint(i));
            } catch {
                // skip invalid surrogate code points
            }
        }
        return chars;
    }

    const ALPHABET: string[] = buildAlphabet();
    const BASE: number = ALPHABET.length;

    function encode(text: string): string {
        const textArr: string[] = Array.from(text);
        const keyArr: string[] = Array.from("nobbam-Fuctyc-zerba3");
        const result: string[] = [];

        for (let i = 0; i < textArr.length; i++) {
            const charCode: number = textArr[i].codePointAt(0)!;
            const keyCode: number = keyArr[i % keyArr.length].codePointAt(0)!;

            const idx: number = (charCode + keyCode) % BASE;
            result.push(ALPHABET[idx]);
        }

        return result.join("");
    }

    function decode(encoded: string): string {
        const textArr: string[] = Array.from(encoded);
        const keyArr: string[] = Array.from("nobbam-Fuctyc-zerba3");
        const result: string[] = [];

        for (let i = 0; i < textArr.length; i++) {
            const idx: number = ALPHABET.indexOf(textArr[i]);
            if (idx === -1) {
                throw new Error(`Invalid character '${textArr[i]}' in encoded string`);
            }

            const keyCode: number = keyArr[i % keyArr.length].codePointAt(0)!;
            const newCode: number = (idx - keyCode + BASE) % BASE;

            result.push(String.fromCodePoint(newCode));
        }

        return result.join("");
    }

    useEffect(() => {
        getToken();
        getLoggedUser();
        getTheme();
        getPushToken();
        getEncryptionType();

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
            encode, decode
        }}>
            {children}
        </NevkaContext.Provider>
    );
};

export const useNevkaProvider = () => useContext(NevkaContext);