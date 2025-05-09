import { ExpoPushToken } from "expo-notifications";
import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from "react";
import { registerForNotifications } from "../providers/expoNotifications";
import * as Notifications from "expo-notifications";
import AsyncStorage from '@react-native-async-storage/async-storage';

const NevkaContext = createContext({});

export default function NevkaProvider({children}: PropsWithChildren) {
    const [token, setToken] = useState<string>("");
    const [loggedUser, setLoggedUser] = useState<string>("");
    const [messageCounter, setMessageCounter] = useState<number>(0);
    const [isNameSet, setIsNameSet] = useState<boolean>(false);
    const [pushToken, setPushToken] = useState<string>();
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();

    // implement async storage
    // https://react-native-async-storage.github.io/async-storage/docs/usage

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldPlaySound: false,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
    });

    useEffect(() => {
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