import { ActivityIndicator, StyleSheet, Image, useColorScheme, FlatList } from "react-native";
import FullWidthImage from 'react-native-fullwidth-image'
import { View, Text } from "@/src/components/Themed";
import { useEffect, useState } from "react";
import { useNevkaProvider } from "@/src/providers/nevkaProvider";
import { Redirect, useLocalSearchParams } from "expo-router";
import Colors from "@/src/constants/Colors";

type UserData = {
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
            <View style={{flexDirection: 'row', height: 150 }}>
                <Image style={{
                    height: '100%',
                    aspectRatio: 1,
                    borderRadius: 15,
                    borderWidth: 1,
                    borderColor: useColorScheme() === 'light' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)'}}
                    source={{uri: user.avatar}}></Image>
                <View style={{ flexDirection: 'column', justifyContent: 'space-around', height: '100%', padding: '2%', paddingLeft: '4%' }}>
                    <Text style={{ fontSize: 32 }}>{user.firstname}</Text>
                    <Text style={{ fontSize: 32, paddingBottom: 10 }}>{user.lastname}</Text>
                    {user.online === 'online' && <Text style={{fontSize: 18, color: useColorScheme() === 'light' ? 'darkgreen' : 'lightgreen'}}>{'\nОнлайн'}</Text>}
                    {user.online !== 'online' && <Text style={{fontSize: 18, color: useColorScheme() === 'light' ? 'darkslategray' : 'lightslategray'}}>{'Был(а) в сети:\n' + user.online}</Text>}
                </View>
            </View>
            <Text style={{
                fontSize: 18,
                textAlign: 'center',
                padding: '4%'
            }}>{user.status}</Text>
            { user.city != "" ? <Text style={{ fontSize: 18, }}>Город: {user.city}</Text> : null}
            { user.bio != "" ? <Text style={{ fontSize: 18, paddingVertical: '3%' }}>Информация: {user.bio}</Text> : null}
        </View>
    );
}

const WallPost = ({ item, user }: WallPostProps) => {
    return (
        <View style={{
            width: '100%',
            padding: '3%'
            }}>

        <View style={{
            flexDirection: 'row', height: 50, paddingBottom: '2%' }}>
            <Image style={{
                height: '100%',
                aspectRatio: 1,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: useColorScheme() === 'light' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)'}}
                source={{uri: user.avatar}}>
            </Image>
            <View style={{ flexDirection: 'column', justifyContent: 'space-around', height: '100%', paddingLeft: '2%' }}>
                <Text style={{ fontSize: 18 }}>{user.firstname} {user.lastname}</Text>
                <Text style={{ fontSize: 18, color: useColorScheme() === 'light' ? 'darkslategray' : 'lightslategray' }}>{item.formattedTime}</Text>
            </View>
        </View>
        <View style={{flexDirection: 'column'}}>
            <Text style={{ fontSize: 18 }}>{item.text}</Text>
            { item.image != "" ? <FullWidthImage style={{
                width: '100%',
                borderRadius: 7,
                marginTop: 10,
                borderWidth: 1,
                borderColor: useColorScheme() === 'light' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)'}}
                source={{uri: item.image}}>
            </FullWidthImage> : null}

        </View>

        </View>
    );
}

export default function person () {
    const { token, loggedUser }: any = useNevkaProvider();
    if ( token == "") { return <Redirect href={'/'} /> };
    const { id } = useLocalSearchParams<{ id: string }>();

    const [userData, setUserData] = useState<UserData>();
    const [wallData, setWallData] = useState<WallData[]>([]);
    const [loading, setLoading] = useState(true);
    const [wallLoading, setWallLoading] = useState(true);
    const [update, setUpdate] = useState(0);
    setTimeout(() => setUpdate(update+1), 60000);

    const colorScheme = useColorScheme();

    const getUserData = async (id: string) => {
        const formData = new FormData();
        formData.append("id", id);

        try {
            const response = await fetch('https://nevka.site/api/getUserData.php', {
                method: 'POST',
                body: formData
            });
            const json = await response.json();
            if (json.result == "failure") {
                console.log("getUserData error: " + json.error)
            } else if (json.result == "success") {
                setUserData(json);
            }
        } catch (error) {
            console.log("Ошибка запроса данных пользователя, проблемы с соединением?\n" + error);
        } finally {
            setLoading(false);
        }
    }

    const getWall = async (id: string) => {
        const formData = new FormData();
        formData.append("id", id);

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
        getUserData(id);
        console.log("Updated: UserData");
        getWall(id);
        console.log("Updated: Wall");
    }, [update]);

    return (
        <View style={styles.container}>
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
    }
});