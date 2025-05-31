/**
 * Nevka Mobile v1.0
 * 2025 Avicus Delacroix
 */

import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from "react-native";
import { RelativePathString, router } from "expo-router";

const NevkaContext = createContext({});

type PushDataObject = {
    url?: RelativePathString
};

export default function NevkaProvider({children}: PropsWithChildren) {
    const [token, setTokenLocal] = useState<string>("");
    const [loggedUser, setLoggedUserLocal] = useState<string>("");
    const [theme, setThemeLocal] = useState<string>("");
    const [messageCounter, setMessageCounterLocal] = useState<number>(0);
    const [isNameSet, setIsNameSet] = useState<boolean>(false);
    const [pushToken, setPushTokenLocal] = useState<string>();
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);

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

    useEffect(() => {
        getToken();
        getLoggedUser();
        getTheme();
        getPushToken();

        const notificationListener = Notifications.addNotificationReceivedListener(notif => {
            setNotification(notif);
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            const data: PushDataObject = response.notification.request.content.data;
            if (data.url) {
                router.navigate(data.url, {withAnchor: true})
            }
        });

        return () => {
            notificationListener.remove();
            responseListener.remove();
        };
    }, [])

    return(
        <NevkaContext.Provider value={{
            token, setToken,
            loggedUser, setLoggedUser,
            messageCounter, setMessageCounter,
            isNameSet, setIsNameSet,
            pushToken, setPushToken,
            theme, setTheme
            }}>
            {children}
        </NevkaContext.Provider>
    );
};

export const useNevkaProvider = () => useContext(NevkaContext);