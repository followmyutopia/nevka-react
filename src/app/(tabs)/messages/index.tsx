/**
 * Nevka Mobile v1.5
 * 2025 Avicus Delacroix
 */

import { StyleSheet, Image, useColorScheme, ActivityIndicator, FlatList, Pressable } from "react-native";
import { View, Text } from "@/src/components/Themed";
import { useNevkaProvider } from "@/src/providers/nevkaProvider";
import { Link, Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Notifications from "expo-notifications";
import Colors from "@/src/constants/Colors";
import Dialog from "react-native-dialog";
import { registerForNotifications } from "../../../providers/expoNotifications";
import { useIsFocused } from "@react-navigation/native";

type ChatsData = {
    id: string,
    firstname: string,
    lastname: string,
    lastText: string,
    isUnread: string,
    online: string,
    avatar: string,
    lastTextAuthor: string,
    encrypted?: boolean
};

type ChatsListItemProps = {
    user: ChatsData,
    loggedUser: string
}

const ChatsListItem = ({ user, loggedUser }: ChatsListItemProps) => {
    return (
        <Link href={{
            pathname: '/(tabs)/messages/chat',
            params: { id: user.id, name: user.firstname + " " + user.lastname }
        }} asChild>
            <Pressable style={{ width: '100%', paddingHorizontal: '3%', paddingVertical: '2%' }}>
                <View style={{ flexDirection: 'row', height: 70 }}>
                    <Image style={{
                        height: '100%',
                        aspectRatio: 1,
                        borderRadius: 25,
                        borderWidth: 1,
                        borderColor: useColorScheme() === 'light' ? Colors.light.borders : Colors.dark.borders
                    }}
                        source={{ uri: user.avatar }}></Image>
                    <View style={{ flexDirection: 'column', justifyContent: 'space-around', height: '100%', padding: '2%', paddingLeft: '4%', flex: 1 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 18, flex: 1 }} numberOfLines={1}>{user.firstname + " " + user.lastname}</Text>
                            {user.online === 'online' && <Text style={{ fontSize: 18, color: useColorScheme() === 'light' ? 'darkgreen' : 'lightgreen' }} numberOfLines={1}>{'Онлайн'}</Text>}
                            {user.online !== 'online' && <Text style={{ fontSize: 16, color: useColorScheme() === 'light' ? 'darkslategray' : 'lightslategray' }} numberOfLines={1}>{user.online}</Text>}
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 16, flex: 1, color: useColorScheme() === 'light' ? 'darkslategray' : 'lightslategray' }} numberOfLines={1}>{user.lastTextAuthor == loggedUser ? "Вы: " : ""}{user.encrypted ? <FontAwesome
                                name={'lock'}
                                size={16}
                            /> : null}{user.encrypted ? " " : null}{user.lastText != "" ? user.lastText : "(изображение)"}</Text>
                            {user.isUnread == '1' && user.lastTextAuthor != loggedUser ? <FontAwesome
                                name="circle"
                                size={16}
                                color='orange'
                                style={{ marginLeft: '3%' }}
                            /> : user.isUnread == '1' && user.lastTextAuthor == loggedUser ? <FontAwesome
                                name="circle"
                                size={16}
                                color='lightslategray'
                                style={{ marginLeft: '3%' }}
                            /> : null}
                        </View>
                    </View>
                </View>
            </Pressable>
        </Link>
    );
}

export default function messages() {
    const { token, setToken, loggedUser, messageCounter, setMessageCounter, isNameSet, decode, notificationStatus, setNotificationStatus, pushToken, setPushToken }: any = useNevkaProvider();
    if (token == "") { return <Redirect href={'/'} /> };

    const [update, setUpdate] = useState(0);
    const colorScheme = useColorScheme();
    const [chatsData, setChatsData] = useState<ChatsData[]>();
    const [loading, setLoading] = useState(true);
    const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
    const isFocused = useIsFocused();

    const getChats = async (token: string) => {
        const formData = new FormData();
        formData.append("token", token);
        formData.append("api-key", "qonxod-Kicmad-4puvhy");
        if (loggedUser == "1") formData.append("safe", "true");

        try {
            const response = await fetch('https://nevka.site/api/getChats.php', {
                method: 'POST',
                body: formData
            });
            const json = await response.json();
            if (json.result == "failure") {
                if (json.error == "wrong_token") {
                    setToken("");
                }
                console.log("getChats error: " + json.error)
            } else if (json.result == "empty") {
                setChatsData([]);
                console.log(json.error);
            } else if (json.result == "success") {
                json.chats.pop();
                json.chats.forEach((obj: ChatsData) => {
                    if ((/^NE[1234]\[/.test(obj.lastText)) && obj.lastText.endsWith("]")) {
                        obj.lastText = "[Устаревшее шифрование]";
                        obj.encrypted = true;
                    } else if ((/^NE[678]\[/.test(obj.lastText)) && obj.lastText.endsWith("]")) {
                        obj.lastText = "[Обновите приложение]";
                        obj.encrypted = true;
                    } else if (obj.lastText.startsWith("NE5[") && obj.lastText.endsWith("]")) {
                        var keyIdentifier = "";
                        if (loggedUser <= obj.id) {
                            keyIdentifier = "-chat-" + loggedUser + "-" + obj.id;
                        } else {
                            keyIdentifier = "-chat-" + obj.id + "-" + loggedUser;
                        }
                        obj.lastText = decode(obj.lastText.slice(4, -1), "PASTE_PRIVATE_CHAT_KEY_HERE" + keyIdentifier);
                        obj.encrypted = true;
                    } else obj.encrypted = false;
                });
                setChatsData(json.chats);
                let newMessageCounter = json.chats.filter((item: ChatsData) => item.isUnread == '1' && item.lastTextAuthor != loggedUser).length;
                setMessageCounter(newMessageCounter);
                if (newMessageCounter == 0) Notifications.dismissAllNotificationsAsync();
            }
        } catch (error) {
            console.log("Ошибка запроса чатов, проблемы с соединением?\n" + error);
        } finally {
            setLoading(false);
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
                    // if (value === "null") {
                    //     setNotificationSwitch(false);
                    // } else {
                    //     setNotificationSwitch(true);
                    // }
                }
            } catch (error) {
                console.log("Ошибка записи push-токена, проблемы с соединением?\n" + error);
            }
        }
    }

    useEffect(() => {
        if (!isNameSet) {
            router.navigate("/settings");
        }

        const ws = new WebSocket('ws://nevka.site:7190');

        ws.onopen = () => {
            ws.send(JSON.stringify({ token: token, subscribeToChatList: true }));
            console.log("WebSocket connection opened (Chat list)");
        };

        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            data.forEach((obj: ChatsData) => {
                if ((/^NE[1234]\[/.test(obj.lastText)) && obj.lastText.endsWith("]")) {
                    obj.lastText = "[Устаревшее шифрование]";
                    obj.encrypted = true;
                } else if ((/^NE[678]\[/.test(obj.lastText)) && obj.lastText.endsWith("]")) {
                    obj.lastText = "[Обновите приложение]";
                    obj.encrypted = true;
                } else if (obj.lastText.startsWith("NE5[") && obj.lastText.endsWith("]")) {
                    var keyIdentifier = "";
                    if (loggedUser <= obj.id) {
                        keyIdentifier = "-chat-" + loggedUser + "-" + obj.id;
                    } else {
                        keyIdentifier = "-chat-" + obj.id + "-" + loggedUser;
                    }
                    obj.lastText = decode(obj.lastText.slice(4, -1), "PASTE_PRIVATE_CHAT_KEY_HERE" + keyIdentifier);
                    obj.encrypted = true;
                } else obj.encrypted = false;
            });
            setChatsData(data);
            setLoading(false);
            let newMessageCounter = data.filter((item: ChatsData) => item.isUnread == '1' && item.lastTextAuthor != loggedUser).length;
            setMessageCounter(newMessageCounter);
            if (newMessageCounter == 0) Notifications.dismissAllNotificationsAsync();
            console.log("Updated: Chats via WS");
        };

        ws.onclose = (e) => {
            console.log("WebSocket connection closed (Chat list):", e.code);

            if (e.code == 1006 || e.code == 1001) {
                // if websocket is not available or terminated, get messages via API
                getChats(token);
                console.log("Updated: Chats via API");
                setTimeout(() => setUpdate(update + 1), 5000);
            }
        };

        return () => {
            ws.close();
        };
    }, [update]);

    useEffect(() => {
        if (isFocused) {
            if (notificationStatus === "suggest") setShowNotificationPrompt(true);
        }
    }, [isFocused]);

    return (
        <View style={styles.container}>
            {loading ? <ActivityIndicator /> : <FlatList
                style={{ flex: 1, width: '100%' }}
                data={chatsData}
                renderItem={({ item }) => <ChatsListItem user={item} loggedUser={loggedUser} />}
                ListEmptyComponent={<Text style={{ fontSize: 18, textAlign: 'center', margin: 15, color: colorScheme === 'light' ? 'darkslategray' : 'lightslategray' }}>Чатов нет. Перейдите в раздел "Люди" для выбора собеседника.</Text>}
            />}
            <Dialog.Container visible={showNotificationPrompt}>
                <Dialog.Title>Включить уведомления?</Dialog.Title>
                <Dialog.Description>Только о входящих личных сообшениях</Dialog.Description>
                <Dialog.Button label="Не нужно" onPress={() => {
                    setShowNotificationPrompt(false);
                    setNotificationStatus("prompted");
                }} />
                <Dialog.Button label="Включить" onPress={() => {
                    setShowNotificationPrompt(false);
                    setNotificationStatus("prompted");
                    registerForNotifications()
                        .then(async result => {
                            setPushToken(result ?? '');
                        }).then(() => {
                            savePushToken(pushToken);
                        })
                        .catch((error: any) => console.log(`${error}`));
                }} />
            </Dialog.Container>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});