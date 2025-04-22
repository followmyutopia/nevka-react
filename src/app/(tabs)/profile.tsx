import { ActivityIndicator, Button, StyleSheet, Image, useColorScheme } from "react-native";
import { View, Text } from "@/src/components/Themed";
import { useEffect, useState } from "react";
import { useNevkaProvider } from "@/src/providers/nevkaProvider";
import { Redirect } from "expo-router";
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

type UserInfoScreenProps = {
    user: UserData;
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
            <Text style={{ fontSize: 18, }}>Город: {user.city}</Text>
            <Text style={{ fontSize: 18, paddingVertical: '3%' }}>Информация: {user.bio}</Text>
        </View>
    );
}

export default function profile () {
    const { token, loggedUser }: any = useNevkaProvider();
    if ( token == "") { return <Redirect href={'/'} /> };

    const [userData, setUserData] = useState<UserData>();
    const [loading, setLoading] = useState(true);
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
            console.log("Ошибка API запроса, проблемы с соединением?");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUserData(loggedUser);
        console.log("getUserData update complete");
    }, [update]);

    return (
        <View style={styles.container}>
            {loading ? <ActivityIndicator /> : <UserInfoScreen user={userData!}/>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});