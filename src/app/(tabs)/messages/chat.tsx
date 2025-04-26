import { StyleSheet, TextInput, useColorScheme } from "react-native";
import { View, Text } from "@/src/components/Themed";
import { useNevkaProvider } from "@/src/providers/nevkaProvider";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import Colors from "@/src/constants/Colors";
import { useIsFocused } from "@react-navigation/native";

type MessageData = {
    id: string,
    me: boolean,
    text: string,
    image: string,
    timestamp: string,
    formattedTime: string
};

export default function chat () {
    const { token }: any = useNevkaProvider();
    if ( token == "") { return <Redirect href={'/'} /> };
    const { id } = useLocalSearchParams<{ id: string }>();

    const isFocused = useIsFocused();
    const [update, setUpdate] = useState(0);
    const colorScheme = useColorScheme();
    const [messagesData, setMessagesData] = useState<MessageData[]>();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const inputStyle = colorScheme === 'light' ? styles.lightInput : styles.darkInput;

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

    const send = (e: any) => {
        if(e.nativeEvent.key == "Enter"){
            e.stopPropagation();
            e.preventDefault();
            console.log("Sending... " + message);
        }
    }

    useEffect(() => {
        console.log("Focused chat: " + isFocused);
        if (isFocused) {
            setTimeout(() => setUpdate(update+1), 10000);
            getMessages(token, id);
            console.log("Updated: Messages for: " + id);
        }
    }, [update, isFocused]);

    return (
        <View style={styles.container}>
            <Text>Чат: {id}</Text>
            <TextInput
                multiline
                enterKeyHint='send'
                onKeyPress={send}
                style={inputStyle}
                value={message}
                onChangeText={setMessage}
                maxLength={1023}
            ></TextInput>
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
        width: '94%',
        height: 70,
        color: Colors.dark.text,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        padding: '3%',
        borderRadius: 15,
        margin: '3%',
        fontSize: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)'
    },
    lightInput: {
        width: '94%',
        height: 70,
        color: Colors.light.text,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        padding: '3%',
        borderRadius: 15,
        margin: '3%',
        fontSize: 20,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.15)'
    },
});