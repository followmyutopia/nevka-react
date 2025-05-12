import { StyleSheet, Image, useColorScheme, ActivityIndicator, FlatList, Pressable } from "react-native";
import { View, Text } from "@/src/components/Themed";
import { useNevkaProvider } from "@/src/providers/nevkaProvider";
import { Link, Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type ChatsData = {
    id: string,
    firstname: string,
    lastname: string,
    lastText: string,
    isUnread: string,
    online: string,
    avatar: string,
    lastTextAuthor: string
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
                <View style={{flexDirection: 'row', height: 70 }}>
                    <Image style={{
                        height: '100%',
                        aspectRatio: 1,
                        borderRadius: 15,
                        borderWidth: 1,
                        borderColor: useColorScheme() === 'light' ? 'rgba(0, 0, 0, 0.07)' : 'rgba(255, 255, 255, 0.07)'}}
                        source={{uri: user.avatar}}></Image>
                    <View style={{ flexDirection: 'column', justifyContent: 'space-around', height: '100%', padding: '2%', paddingLeft: '4%', flex: 1 }}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{ fontSize: 18, flex: 1 }} numberOfLines={1}>{user.firstname + " " + user.lastname}</Text>
                            {user.online === 'online' && <Text style={{fontSize: 18, color: useColorScheme() === 'light' ? 'darkgreen' : 'lightgreen'}} numberOfLines={1}>{'Онлайн'}</Text>}
                            {user.online !== 'online' && <Text style={{fontSize: 16, color: useColorScheme() === 'light' ? 'darkslategray' : 'lightslategray'}} numberOfLines={1}>{user.online}</Text>}
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{fontSize: 16, flex: 1, color: useColorScheme() === 'light' ? 'darkslategray' : 'lightslategray'}} numberOfLines={1}>{user.lastTextAuthor === loggedUser ? "Вы: " : ""}{user.lastText != "" ? user.lastText : "(изображение)"}</Text>
                            { user.isUnread == '1' && user.lastTextAuthor != loggedUser ? <FontAwesome
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

export default function messages () {
    const { token, loggedUser, setMessageCounter, isNameSet }: any = useNevkaProvider();
    if ( token == "") { return <Redirect href={'/'} /> };

    const [update, setUpdate] = useState(0);
    const colorScheme = useColorScheme();
    const [chatsData, setChatsData] = useState<ChatsData[]>();
    const [loading, setLoading] = useState(true);

    const getChats = async (token: string) => {
        const formData = new FormData();
        formData.append("token", token);
        formData.append("api-key", "qonxod-Kicmad-4puvhy");

        try {
            const response = await fetch('https://nevka.site/api/getChats.php', {
                method: 'POST',
                body: formData
            });
            const json = await response.json();
            if (json.result == "failure") {
                console.log("getChats error: " + json.error)
            } else if (json.result == "empty") {
                setChatsData([]);
                console.log(json.error);
            } else if (json.result == "success") {
                json.chats.pop();
                setChatsData(json.chats);
                let newMessageCounter = json.chats.filter((item: ChatsData) => item.isUnread == '1' && item.lastTextAuthor != loggedUser).length;
                setMessageCounter(newMessageCounter);
            }
        } catch (error) {
            console.log("Ошибка запроса чатов, проблемы с соединением?\n" + error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!isNameSet) {
            router.navigate("/settings");
        }
        setTimeout(() => setUpdate(update+1), 5000);
        getChats(token);
        console.log("Updated: Chats");
    }, [update]);

    return (
        <View style={styles.container}>
            {loading ? <ActivityIndicator /> : <FlatList
                style={{flex: 1, width: '100%'}}
                data={chatsData}
                renderItem={({ item }) => <ChatsListItem user={item} loggedUser={loggedUser}/>}
                ListEmptyComponent={<Text style={{fontSize: 18, textAlign: 'center', margin: 15, color: colorScheme === 'light' ? 'darkslategray' : 'lightslategray'}}>Чатов нет. Перейдите в раздел "Люди" для выбора собеседника.</Text>}
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
});