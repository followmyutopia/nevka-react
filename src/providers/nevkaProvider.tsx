import { ExpoPushToken } from "expo-notifications";
import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from "react";
import { registerForNotifications } from "../providers/expoNotifications";
import * as Notifications from "expo-notifications";

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

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

    useEffect(() => {
        registerForNotifications()
            .then(token => setPushToken(token ?? ''))
            .catch((error: any) => console.log(`${error}`));

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
        
        console.log("Push token is: " + pushToken);
    }, [])

    return(
        <NevkaContext.Provider value={{
            token, setToken, loggedUser, setLoggedUser,
            messageCounter, setMessageCounter,
            isNameSet, setIsNameSet
            }}>
            {children}
        </NevkaContext.Provider>
    );
};

export const useNevkaProvider = () => useContext(NevkaContext);