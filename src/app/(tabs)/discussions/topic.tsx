import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, useColorScheme } from "react-native";
import { View, Text } from "@/src/components/Themed";
import { useNevkaProvider } from "@/src/providers/nevkaProvider";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import Colors from "@/src/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useHeaderHeight } from "@react-navigation/elements"

type TopicMessageData = {
    name: string,
    text: string,
    timestamp: string,
    formattedTime: string
};

type TopicHeaderProps = {
    header: string,
    author: string,
    message: string,
    time: string
}

type TopicMessageProps = {
    item: TopicMessageData
}

const TopicHeader = ({ header, author, message, time }: TopicHeaderProps) => {
    return (
        <View style={{ padding: '3%', width: '100%', paddingBottom: 0}}>
            <Text style={{fontSize: 32, marginBottom: 10}}>{header}</Text>
            <Text style={{fontSize: 17, marginBottom: 10, color: useColorScheme() === 'light' ? 'darkslategray' : 'lightslategray'}}>{author} ({time})</Text>
            <Text style={{fontSize: 17}}>{message}</Text>
        </View>
    );
};

const TopicMessage = ({ item }: TopicMessageProps) => {
    return (
        <View style={{ padding: '3%', paddingTop: 0}}>
            <Text style={{fontSize: 17, marginBottom: 5, textDecorationLine: 'underline'}}>{item.name}:<Text style={{fontSize: 17, textDecorationLine: 'none', color: useColorScheme() === 'light' ? 'darkslategray' : 'lightslategray'}}> ({item.formattedTime})</Text></Text>
            <Text style={{fontSize: 17}}>{item.text}</Text>
        </View>
    );
};

export default function topic () {
    const { token }: any = useNevkaProvider();
    if ( token == "") { return <Redirect href={'/'} /> };
    const { id } = useLocalSearchParams<{ id: string }>();

    const colorScheme = useColorScheme();
    const isFocused = useIsFocused();
    const [update, setUpdate] = useState(0);
    const [topicMessages, setTopicMessages] = useState<TopicMessageData[]>();
    const [header, setHeader] = useState();
    const [author, setAuthor] = useState();
    const [message, setMessage] = useState();
    const [newMessage, setNewMessage] = useState("");
    const [time, setTime] = useState();
    const [loading, setLoading] = useState(true);
    const inputStyle = colorScheme === 'light' ? styles.lightInput : styles.darkInput;
    const [sending, setSending] = useState(false);
    const headerHeight = useHeaderHeight();

    const getTopic = async (discussion: string) => {
        const formData = new FormData();
        formData.append("id", discussion);

        try {
            const response = await fetch('https://nevka.site/api/getTopic.php', {
                method: 'POST',
                body: formData
            });
            const json = await response.json();
            if (json.result == "failure") {
                console.log("getTopic error: " + json.error)
            } else if (json.result == "empty") {
                setHeader(json.header);
                setAuthor(json.author);
                setMessage(json.topicMessage);
                setTime(json.formattedTime);
                setTopicMessages([]);
            } else if (json.result == "success") {
                json.messages.pop();
                setHeader(json.header);
                setAuthor(json.author);
                setMessage(json.topicMessage);
                setTime(json.formattedTime);
                setTopicMessages(json.messages);
            }
        } catch (error) {
            console.log("Ошибка запроса темы " + discussion + ", проблемы с соединением?\n" + error);
        } finally {
            setLoading(false);
        }
    }

    const sendTopicReply = async () => {
        let text = newMessage.trim();

        if (!sending && text != "") {
            setSending(true);

            const formData = new FormData();
            formData.append("token", token);
            formData.append("topic", id);
            formData.append("text", text);

            try {
                const response = await fetch('https://nevka.site/api/sendTopicReply.php', {
                    method: 'POST',
                    body: formData
                });
                const json = await response.json();
                if (json.result == "failure") {
                    console.log(json.error);
                } else if (json.result == "success") {
                    setNewMessage("");
                }
            } catch (error) {
                console.log("Ошибка отправки ответа на тему " + id + ", проблемы с соединением?\n" + error);
            } finally {
                setSending(false);
            }
        }
    }

    const sendMessage = () => {
        console.log("Sending... " + newMessage);
    };

    useEffect(() => {
        if (isFocused) {
            setTimeout(() => setUpdate(update+1), 10000);
            getTopic(id);
            console.log("Updated: Topic with ID: " + id);
        }
    }, [update, isFocused]);
    
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: header || "Загрузка..." }} />
            {loading ? null : <TopicHeader header={header!} author={author!} message={message!} time={time!}/>}
            {loading ? null : <KeyboardAvoidingView
                style={{flexDirection: 'row', padding: '3%'}}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={headerHeight}>
                <TextInput
                    multiline
                    enterKeyHint='send'
                    style={inputStyle}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    maxLength={1023}
                    submitBehavior='submit'
                    onSubmitEditing={sendTopicReply}
                ></TextInput>
                <Pressable style={{justifyContent: 'center', alignItems: 'flex-end', marginLeft: '3%', marginBottom: '3%'}}
                onPress={sendTopicReply}>
                    {({ pressed }) => (
                        <FontAwesome
                        name="arrow-circle-o-down"
                        size={27}
                        color={Colors[useColorScheme() ?? 'light'].text}
                        style={{ opacity: pressed ? 0.5 : 1 }}
                        />
                    )}
                </Pressable>
            </KeyboardAvoidingView>}
            {loading ? <ActivityIndicator style={{flex: 1}}/> : <FlatList
                style={{flex: 1, width: '100%'}}
                data={topicMessages}
                renderItem={({ item }) => <TopicMessage item={item}/>}
                ListEmptyComponent={<Text style={{fontSize: 18, textAlign: 'center', margin: 15, color: colorScheme === 'light' ? 'darkslategray' : 'lightslategray'}}>Ответов нет</Text>}
            />}
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
        fontSize: 17,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        marginBottom: '3%'
    },
    lightInput: {
        flex: 1,
        maxHeight: 80,
        color: Colors.light.text,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        padding: '3%',
        borderRadius: 15,
        fontSize: 17,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.15)',
        marginBottom: '3%'
    },
});