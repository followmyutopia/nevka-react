import { ActivityIndicator, StyleSheet, Image, useColorScheme, FlatList, Pressable } from "react-native";
import FullWidthImage from 'react-native-fullwidth-image'
import { View, Text } from "@/src/components/Themed";
import { useEffect, useState } from "react";
import { useNevkaProvider } from "@/src/providers/nevkaProvider";
import { Redirect, router, Stack, useLocalSearchParams } from "expo-router";
import { useIsFocused } from "@react-navigation/native";

type UserData = {
    id: string,
    firstname: string,
    lastname: string,
    status: string,
    city: string,
    bio: string,
    timestamp: number,
    avatar: string,
    online: string
};

type WallData = {
    id: string,
    text: string,
    image: string,
    timestamp: string,
    formattedTime: string
};

type UserInfoScreenProps = {
    user: UserData;
}

type WallPostProps = {
    item: WallData,
    user: UserData
}

const UserInfoScreen = ({ user }: UserInfoScreenProps) => {
    return (
        <View style={{ width: '100%', padding: '3%' }}>
            <View style={{flexDirection: 'row', height: 150, paddingBottom: '4%' }}>
                <Image style={{
                    height: '100%',
                    aspectRatio: 1,
                    borderRadius: 15,
                    borderWidth: 1,
                    borderColor: useColorScheme() === 'light' ? 'rgba(0, 0, 0, 0.07)' : 'rgba(255, 255, 255, 0.07)'}}
                    source={{uri: user.avatar}}></Image>
                <View style={{ flexDirection: 'column', justifyContent: 'space-around', height: '100%', padding: '2%', paddingLeft: '4%' }}>
                    <Text style={{ fontSize: 32 }}>{user.firstname}</Text>
                    <Text style={{ fontSize: 32, paddingBottom: 10 }}>{user.lastname}</Text>
                    {user.online === 'online' && <Text style={{fontSize: 18, color: useColorScheme() === 'light' ? 'darkgreen' : 'lightgreen'}}>{'\nОнлайн'}</Text>}
                    {user.online !== 'online' && <Text style={{fontSize: 18, color: useColorScheme() === 'light' ? 'darkslategray' : 'lightslategray'}}>{'Был(а) в сети:\n' + user.online}</Text>}
                </View>
            </View>
            { user.status != "" ? <Text style={{
                fontSize: 18,
                textAlign: 'center',
                paddingBottom: '4%',
                paddingHorizontal: '4%'
            }}>{user.status}</Text> : null}
            { user.city != "" || user.bio != "" ? <View style={{
                borderColor: useColorScheme() === 'light' ? 'rgba(0, 0, 0, 0.07)' : 'rgba(255, 255, 255, 0.07)',
                borderRadius: 15,
                borderWidth: 1,
                padding: 15,
                marginBottom: '4%',
                gap: 10
            }}>
                { user.city != "" ? <Text style={{ fontSize: 18, }}>Город: {user.city}</Text> : null}
                { user.bio != "" ? <Text style={{ fontSize: 18 }}>Информация: {user.bio}</Text> : null}
            </View> : null}
            <Pressable
                style={({pressed}) => [useColorScheme() === 'light' ? styles.lightButton : styles.darkButton, { backgroundColor: pressed ? useColorScheme() === 'light' ? 'rgba(0, 0, 0, 0.11)' : 'rgba(255, 255, 255, 0.11)' : useColorScheme() === 'light' ? styles.lightButton.backgroundColor : styles.darkButton.backgroundColor }]}
                onPress={() => router.navigate(`/(tabs)/messages/chat?id=${user.id}&name=${user.firstname + " " + user.lastname}`, {withAnchor: true})}
                >
                <Text style={styles.buttonText}>Отправить сообщение</Text>
            </Pressable>
        </View>
    );
}

const WallPost = ({ item, user }: WallPostProps) => {
    return (
        <View style={{
            width: '94%',
            margin: '3%',
            borderColor: useColorScheme() === 'light' ? 'rgba(0, 0, 0, 0.07)' : 'rgba(255, 255, 255, 0.07)',
            borderRadius: 15,
            borderWidth: 1,
            padding: 15,
            }}>

        <View style={{
            flexDirection: 'row', height: 50, paddingBottom: '2%' }}>
            <Image style={{
                height: '100%',
                aspectRatio: 1,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: useColorScheme() === 'light' ? 'rgba(0, 0, 0, 0.07)' : 'rgba(255, 255, 255, 0.07)'}}
                source={{uri: user.avatar}}>
            </Image>
            <View style={{ flexDirection: 'column', justifyContent: 'space-around', height: '100%', paddingLeft: '2%' }}>
                <Text style={{ fontSize: 18 }}>{user.firstname} {user.lastname}</Text>
                <Text style={{ fontSize: 18, color: useColorScheme() === 'light' ? 'darkslategray' : 'lightslategray' }}>{item.formattedTime}</Text>
            </View>
        </View>
        <View style={{flexDirection: 'column'}}>
            { item.text != "" ? <Text style={{ fontSize: 18 }}>{item.text}</Text> : null}
            { item.image != "" ? <FullWidthImage style={{
                width: '100%',
                borderRadius: 10,
                marginTop: 10,
                borderWidth: 1,
                borderColor: useColorScheme() === 'light' ? 'rgba(0, 0, 0, 0.07)' : 'rgba(255, 255, 255, 0.07)'}}
                source={{uri: item.image}}>
            </FullWidthImage> : null}

        </View>

        </View>
    );
}

export default function person () {
    const { token, setToken, loggedUser }: any = useNevkaProvider();
    if ( token == "") { return <Redirect href={'/'} /> };
    const { id, name } = useLocalSearchParams<{ id: string, name: string }>();

    const isFocused = useIsFocused();
    const [update, setUpdate] = useState(0);
    const [userData, setUserData] = useState<UserData>();
    const [wallData, setWallData] = useState<WallData[]>([]);
    const [loading, setLoading] = useState(true);
    const [wallLoading, setWallLoading] = useState(true);

    const colorScheme = useColorScheme();

    const getUserData = async (id: string) => {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("token", token);
        formData.append("api-key", "qonxod-Kicmad-4puvhy");

        try {
            const response = await fetch('https://nevka.site/api/getUserData.php', {
                method: 'POST',
                body: formData
            });
            const json = await response.json();
            if (json.result == "failure") {
                if (json.error == "wrong_token") {
                    setToken("");
                }
                console.log("getUserData error: " + json.error)
            } else if (json.result == "success") {
                setUserData(json);
                setLoading(false);
            }
        } catch (error) {
            console.log("Ошибка запроса данных пользователя, проблемы с соединением?\n" + error);
        }
    }

    const getWall = async (id: string) => {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("api-key", "qonxod-Kicmad-4puvhy");

        try {
            const response = await fetch('https://nevka.site/api/getWall.php', {
                method: 'POST',
                body: formData
            });
            const json = await response.json();
            if (json.result == "failure") {
                console.log("getUserData error: " + json.error)
            } else if (json.result == "empty") {
                setWallData([]);
            } else if (json.result == "success") {
                json.wall.pop();
                setWallData(json.wall);
            }
        } catch (error) {
            console.log("Ошибка запроса стены, проблемы с соединением?\n" + error);
        } finally {
            setWallLoading(false);
        }
    }

    useEffect(() => {
        if (isFocused) {
            setTimeout(() => setUpdate(update+1), 5000);
            getUserData(id);
            console.log("Updated: UserData for: " + id);
            getWall(id);
            console.log("Updated: Wall for: " + id);
        }
    }, [update, isFocused]);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: name }} />
            {loading ? <ActivityIndicator /> : <FlatList
                ListHeaderComponent={<UserInfoScreen user={userData!}/>}
                style={{flex: 1, width: '100%'}}
                data={wallData || <ActivityIndicator /> }
                renderItem={({ item }) => <WallPost item={item} user={userData!}/>}
                ListEmptyComponent={<Text style={{fontSize: 18, textAlign: 'center', margin: 15, color: colorScheme === 'light' ? 'darkslategray' : 'lightslategray'}}>Записей на стене нет</Text>}
            />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    darkButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        // width: '90%',
        // margin: '2%',
        borderRadius: 15,
        padding: '3%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.07)',
        // marginVertical: '3%'
    },
    lightButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.07)',
        // width: '90%',
        // margin: '2%',
        borderRadius: 15,
        padding: '3%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.07)',
        // marginVertical: '3%'
    },
    buttonText: {
        fontSize: 20
    }
});