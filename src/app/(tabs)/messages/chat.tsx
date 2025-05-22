import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, useColorScheme } from "react-native";
import { View, Text } from "@/src/components/Themed";
import { useNevkaProvider } from "@/src/providers/nevkaProvider";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import Colors from "@/src/constants/Colors";
import { useIsFocused } from "@react-navigation/native";
import FullWidthImage from "react-native-fullwidth-image";
import { FontAwesome } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import * as ImagePicker from 'expo-image-picker';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

type MessageData = {
    id: string,
    me: string,
    text: string,
    image: string,
    timestamp: string,
    formattedTime: string,
    isUnread: string,
    reply: string
};

type MessageItemProps = {
    item: MessageData,
    replyHandler: (id: any) => void
}

const MessageItem = ({ item, replyHandler }: MessageItemProps) => {
    const renderRightActions = () => {
        return (
            <View style={{width: 1}}></View>
        );
    };

    return (
        <Swipeable
            hitSlop={{left: -60}}
            renderRightActions={() => renderRightActions() }
            onSwipeableWillOpen={() => replyHandler(item.id)}
            ref={(ref) => ref?.close()}
            >
        <View style={{
            backgroundColor: useColorScheme() === 'light' ? 'rgba(0, 0, 0, 0.07)' : 'rgba(255, 255, 255, 0.07)',
            borderColor: useColorScheme() === 'light' ? 'rgba(0, 0, 0, 0.07)' : 'rgba(255, 255, 255, 0.07)',
            borderWidth: 1,
            alignSelf: item.me === 'true' ? 'flex-end' : 'flex-start',
            borderRadius: 10,
            maxWidth: '84%',
            marginHorizontal: '3%',
            marginVertical: '1%'
            }}>
            {item.reply != "" ? <View style={{
                backgroundColor: useColorScheme() === 'light' ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 255, 255, 0)',
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderBottomColor: useColorScheme() === 'light' ? 'rgba(0, 0, 0, 0.07)' : 'rgba(255, 255, 255, 0.07)'
                }}><FontAwesome
                    name="reply"
                    size={16}
                    color={useColorScheme() === 'light' ? 'darkslategray' : 'lightslategray'}
                    style={{ marginTop: 5, marginLeft: 7 }}/>
                    <Text
                        numberOfLines={1}
                        style={{
                            fontSize: 16,
                            marginVertical: 4,
                            marginHorizontal: 7,
                            marginRight: 28,
                            color: useColorScheme() === 'light' ? 'darkslategray' : 'lightslategray'
                    }}>{item.reply}</Text></View> : null}
            { item.text != "" ? <Text style={{
                fontSize: 17,
                paddingHorizontal: 7,
                paddingTop: 5,
                paddingBottom: item.image != "" ? 2 : 0
            }}>{item.text}</Text> : null}
            { item.image != "" ? <FullWidthImage style={{
                minWidth: '100%',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: useColorScheme() === 'light' ? 'rgba(0, 0, 0, 0.07)' : 'rgba(255, 255, 255, 0.07)'
            }} source={{uri: item.image}}>
            </FullWidthImage> : null}
            <View style={{
                backgroundColor: useColorScheme() === 'light' ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 255, 255, 0)',
                flexDirection: 'row', justifyContent: 'space-between'
                }}>
                <FontAwesome
                    name={item.isUnread == '1' ? 'circle' : 'check-circle'}
                    size={14}
                    color={useColorScheme() === 'light' ? 'darkslategray' : 'lightslategray'}
                    style={{ marginTop: 3, marginLeft: 7 }}
                    />
                <Text style={{
                    fontSize: 14,
                    marginVertical: 2,
                    marginHorizontal: 7,
                    color: useColorScheme() === 'light' ? 'darkslategray' : 'lightslategray'
                }}>{item.formattedTime}</Text>
            </View>
        </View>
        </Swipeable>
    );
}

export default function chat () {
    const { token, setToken }: any = useNevkaProvider();
    if ( token == "") { return <Redirect href={'/'} /> };
    const { id, name } = useLocalSearchParams<{ id: string, name: string }>();

    const isFocused = useIsFocused();
    const [update, setUpdate] = useState(0);
    const colorScheme = useColorScheme();
    const [messagesData, setMessagesData] = useState<MessageData[]>();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const inputStyle = colorScheme === 'light' ? styles.lightInput : styles.darkInput;
    const headerHeight = useHeaderHeight();
    const [image, setImage] = useState("");
    const [status, setStatus] = useState("");
    const [sending, setSending] = useState(false);
    const [replyTo, setReplyTo] = useState("");
    const [textToReply, setTextToReply] = useState("");

    const getMessages = async (token: string, chat: string) => {
        const formData = new FormData();
        formData.append("token", token);
        formData.append("chat", chat);
        formData.append("api-key", "qonxod-Kicmad-4puvhy");

        try {
            const response = await fetch('https://nevka.site/api/getMessages.php', {
                method: 'POST',
                body: formData
            });
            const json = await response.json();
            if (json.result == "failure") {
                if (json.error == "wrong_token") {
                    setToken("");
                }
                console.log("getMessages error: " + json.error)
            } else if (json.result == "empty") {
                setMessagesData([]);
            } else if (json.result == "success") {
                json.messages.pop();
                setMessagesData(json.messages);
            }
        } catch (error) {
            console.log("Ошибка запроса сообщений с " + chat + ", проблемы с соединением?\n" + error);
        } finally {
            setLoading(false);
        }
    }

    const pickImage = async () => {
        if (!sending) {
            let result = await ImagePicker.launchImageLibraryAsync({
                base64: true
                //   allowsEditing: true,
                //   aspect: [4, 3],
                //   quality: 1,
            });
        
            if (!result.canceled) {
                setImage('data:' + result.assets[0].mimeType + ';base64,' + result.assets[0].base64);
                setStatus("Выбран файл: " + result.assets[0].fileName);
                // need to delete the file from the cache, wtf
            }
        }
    };

    const resetImage = () => {
        if (!sending) {
            setImage("");
            setStatus("");
        }
    };

    const sendMessage = async () => {
        let text = message.trim();

        if (!sending && id && (text != "" || image != "")) {
            setSending(true);
            setStatus("Отправка...");

            const formData = new FormData();
            formData.append("token", token);
            formData.append("chat", id);
            formData.append("text", text);
            formData.append("image", image);
            formData.append("reply", replyTo);
            formData.append("api-key", "qonxod-Kicmad-4puvhy");

            setMessage("");
            setImage("");
            setReplyTo("");

            try {
                const response = await fetch('https://nevka.site/api/sendMessage.php', {
                    method: 'POST',
                    body: formData
                });
                const json = await response.json();
                if (json.result == "failure") {
                    if (json.error == "wrong_token") {
                        setToken("");
                    }
                    setStatus(json.error);
                    setMessage(text);
                } else if (json.result == "success") {
                    setStatus("");
                }
            } catch (error) {
                console.log("Ошибка отправки сообщения " + id + ", проблемы с соединением?\n" + error);
            } finally {
                setSending(false);
            }
        }
    }

    const reply = (id: string) => {
        setReplyTo(id);
        const messageObject = messagesData?.find(item => item.id === id);
        setTextToReply(messageObject?.text || "(изображение)")
    }

    useEffect(() => {
        if (isFocused) {
            const ws = new WebSocket('ws://nevka.site:7190');

            ws.onopen = () => {
                ws.send(JSON.stringify({token: token, subscribeToChat: id}));
                console.log("WebSocket connection opened");
            };

            ws.onmessage = (e) => {
                const data = JSON.parse(e.data);
                setMessagesData(data);
                setLoading(false);
                console.log("Updated: Messages via WS for: " + id);
            };

            ws.onclose = (e) => {
                console.log("WebSocket connection closed:", e.code, e.reason);

                if (e.code == 1006 || e.code == 1001) {
                    // if websocket is not available or terminated, get messages via API
                    getMessages(token, id);
                    console.log("Updated: Messages via API for: " + id);
                    setTimeout(() => setUpdate(update+1), 500);
                }
            };

            return () => {
                ws.close();
            };
        }
    }, [update, isFocused]);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: name }} />
            {loading ? <ActivityIndicator style={{flex: 1}}/> : <FlatList
                inverted
                initialNumToRender={100}
                style={{flex: 1, width: '100%'}}
                data={messagesData}
                contentContainerStyle={{ flexDirection: 'column-reverse' }}
                renderItem={({ item }) => <MessageItem item={item} replyHandler={reply}/>}
                ListEmptyComponent={<Text style={{fontSize: 18, textAlign: 'center', margin: 15, color: colorScheme === 'light' ? 'darkslategray' : 'lightslategray'}}>Сообщений нет</Text>}
            />}
            {replyTo === "" ? null : <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <View style={{justifyContent: 'center', alignItems: 'center', margin: '3%', marginBottom: 0}}>
                    <FontAwesome
                        name="reply"
                        size={27}
                        color={Colors[colorScheme ?? 'light'].text}
                        />
                    </View>
                    <Text numberOfLines={2}
                        style={{
                            color: colorScheme === 'light' ? 'darkslategray' : 'lightslategray',
                            fontSize: 17,
                            margin: '1%',
                            marginBottom: -1,
                            flex: 1,
                            justifyContent: 'center'
                }}>Ответ на: {textToReply}</Text>
                <Pressable style={{justifyContent: 'center', alignItems: 'center', margin: '3%', paddingHorizontal: 4}}
                onPress={() => setReplyTo("")}>
                    {({ pressed }) => (
                        <FontAwesome
                        name="times"
                        size={27}
                        color={Colors[colorScheme ?? 'light'].text}
                        style={{ opacity: pressed ? 0.5 : 1 }}
                        />
                    )}
                </Pressable>
            </View>}
            {status === "" ? null : <Text style={{
                color: colorScheme === 'light' ? 'darkslategray' : 'lightslategray',
                fontSize: 17,
                marginTop: 7,
                marginHorizontal: '3%',
                textAlign: 'center'
            }}>{status}</Text>}
            <KeyboardAvoidingView
                style={{flexDirection: 'row'}}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={headerHeight}
                >
                {image === "" ? <Pressable style={{justifyContent: 'center', alignItems: 'flex-start', margin: '3%'}}
                onPress={pickImage}>
                    {({ pressed }) => (
                        <FontAwesome
                        name="picture-o"
                        size={27}
                        color={Colors[useColorScheme() ?? 'light'].text}
                        style={{ opacity: pressed ? 0.5 : 1 }}
                        />
                    )}
                </Pressable> : <Pressable style={{justifyContent: 'center', alignItems: 'flex-start', margin: '3%', paddingHorizontal: 1}}
                onPress={resetImage}>
                    {({ pressed }) => (
                        <FontAwesome
                        name="window-close-o"
                        size={27}
                        color={Colors[useColorScheme() ?? 'light'].text}
                        style={{ opacity: pressed ? 0.5 : 1 }}
                        />
                    )}
                </Pressable>}
                <TextInput
                    multiline
                    enterKeyHint='send'
                    style={inputStyle}
                    value={message}
                    onChangeText={setMessage}
                    maxLength={1023}
                    submitBehavior='submit'
                    onSubmitEditing={sendMessage}
                ></TextInput>
                <Pressable style={{justifyContent: 'center', alignItems: 'flex-end', margin: '3%'}}
                onPress={sendMessage}>
                    {({ pressed }) => (
                        <FontAwesome
                        name="paper-plane-o"
                        size={27}
                        color={Colors[useColorScheme() ?? 'light'].text}
                        style={{ opacity: pressed ? 0.5 : 1 }}
                        />
                    )}
                </Pressable>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    darkInput: {
        flex: 1,
        maxHeight: 80,
        color: Colors.dark.text,
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        padding: '3%',
        borderRadius: 15,
        marginVertical: '3%',
        fontSize: 17,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.07)'
    },
    lightInput: {
        flex: 1,
        maxHeight: 80,
        color: Colors.light.text,
        backgroundColor: 'rgba(0, 0, 0, 0.07)',
        padding: '3%',
        borderRadius: 15,
        marginVertical: '3%',
        fontSize: 17,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.07)'
    },
});