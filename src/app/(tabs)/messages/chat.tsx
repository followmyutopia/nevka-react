import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, useColorScheme } from "react-native";
import { View, Text } from "@/src/components/Themed";
import { useNevkaProvider } from "@/src/providers/nevkaProvider";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import Colors from "@/src/constants/Colors";
import { useIsFocused } from "@react-navigation/native";
import FullWidthImage from "react-native-fullwidth-image";
import { FontAwesome } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements"
import * as ImagePicker from 'expo-image-picker';

type MessageData = {
    id: string,
    me: string,
    text: string,
    image: string,
    timestamp: string,
    formattedTime: string
};

type MessageItemProps = {
    item: MessageData
}

const MessageItem = ({ item }: MessageItemProps) => {
    return (
        <View style={{
            backgroundColor: useColorScheme() === 'light' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)',
            borderColor: useColorScheme() === 'light' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)',
            borderWidth: 1,
            alignSelf: item.me === 'true' ? 'flex-end' : 'flex-start',
            borderRadius: 10,
            maxWidth: '84%',
            marginHorizontal: '3%',
            marginVertical: '1%'
            }}>
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
                borderColor: useColorScheme() === 'light' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)'
            }} source={{uri: item.image}}>
            </FullWidthImage> : null}
            <Text style={{
                fontSize: 14,
                marginVertical: 2,
                marginHorizontal: 7,
                alignSelf: 'flex-end',
                color: useColorScheme() === 'light' ? 'darkslategray' : 'lightslategray'
            }}>{item.formattedTime}</Text>
        </View>
    );
}

export default function chat () {
    const { token }: any = useNevkaProvider();
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

    const getMessages = async (token: string, chat: string) => {
        const formData = new FormData();
        formData.append("token", token);
        formData.append("chat", chat);

        try {
            const response = await fetch('https://nevka.site/api/getMessages.php', {
                method: 'POST',
                body: formData
            });
            const json = await response.json();
            if (json.result == "failure") {
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
        let result = await ImagePicker.launchImageLibraryAsync({
            base64: true
            //   allowsEditing: true,
            //   aspect: [4, 3],
            //   quality: 1,
        });
    
        if (!result.canceled) {
            setImage('data:' + result.assets[0].mimeType + ';base64,' + result.assets[0].base64);
            setStatus("Выбран файл: " + result.assets[0].fileName);
        }
    };

    const sendMessage = async () => {
        if (!sending) {
            setSending(true);

            const formData = new FormData();
            formData.append("token", token);
            formData.append("chat", id);
            formData.append("text", message);
            formData.append("image", image);

            try {
                const response = await fetch('https://nevka.site/api/sendMessage.php', {
                    method: 'POST',
                    body: formData
                });
                const json = await response.json();
                if (json.result == "failure") {
                    setStatus(json.error);
                } else if (json.result == "success") {
                    setMessage("");
                    setImage("");
                    setStatus("");
                }
            } catch (error) {
                console.log("Ошибка отправки сообщения " + id + ", проблемы с соединением?\n" + error);
            } finally {
                setSending(false);
            }
        }
    }

    useEffect(() => {
        console.log("Focused chat: " + isFocused);
        if (isFocused) {
            setTimeout(() => setUpdate(update+1), 1000);
            getMessages(token, id);
            console.log("Updated: Messages for: " + id);
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
                renderItem={({ item }) => <MessageItem item={item} />}
                ListEmptyComponent={<Text style={{fontSize: 18, textAlign: 'center', margin: 15, color: colorScheme === 'light' ? 'darkslategray' : 'lightslategray'}}>Сообщений нет</Text>}
            />}
            {status === "" ? null : <Text style={{
                color: colorScheme === 'light' ? 'darkslategray' : 'lightslategray',
                fontSize: 17,
                marginTop: 7
            }}>{status}</Text>}
            <KeyboardAvoidingView
                style={{flexDirection: 'row'}}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={headerHeight}
                >
                <Pressable style={{justifyContent: 'center', alignItems: 'flex-start', margin: '3%'}}
                onPress={pickImage}>
                    {({ pressed }) => (
                        <FontAwesome
                        name="picture-o"
                        size={27}
                        color={Colors[useColorScheme() ?? 'light'].text}
                        style={{ opacity: pressed ? 0.5 : 1 }}
                        />
                    )}
                </Pressable>
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
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        padding: '3%',
        borderRadius: 15,
        marginVertical: '3%',
        fontSize: 17,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)'
    },
    lightInput: {
        flex: 1,
        maxHeight: 80,
        color: Colors.light.text,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        padding: '3%',
        borderRadius: 15,
        marginVertical: '3%',
        fontSize: 17,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.15)'
    },
});