import { ExpoPushToken } from "expo-notifications";
import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from "react";
import { registerForNotifications } from "../providers/expoNotifications";
import * as Notifications from "expo-notifications";
import AsyncStorage from '@react-native-async-storage/async-storage';

const NevkaContext = createContext({});

export default function NevkaProvider({children}: PropsWithChildren) {
    const [token, setTokenLocal] = useState<string>("");
    const [loggedUser, setLoggedUserLocal] = useState<string>("");
    const [messageCounter, setMessageCounter] = useState<number>(0);
    const [isNameSet, setIsNameSet] = useState<boolean>(false);
    const [pushToken, setPushToken] = useState<string>();
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();

    // implement async storage
    // https://react-native-async-storage.github.io/async-storage/docs/usage

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

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldPlaySound: false,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
    });

    useEffect(() => {
        getToken();
        getLoggedUser();

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
        });
    
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
        });

        return () => {
            notificationListener.current &&
                Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
                Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, [])

    return(
        <NevkaContext.Provider value={{
            token, setToken,
            loggedUser, setLoggedUser,
            messageCounter, setMessageCounter,
            isNameSet, setIsNameSet,
            pushToken, setPushToken
            }}>
            {children}
        </NevkaContext.Provider>
    );
};

export const useNevkaProvider = () => useContext(NevkaContext);