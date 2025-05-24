/**
 * Nevka Mobile v1.0
 * 2025 Avicus Delacroix
 */

import { ActivityIndicator, StyleSheet, Image, TextInput, useColorScheme, Pressable, FlatList } from "react-native";
import { View, Text } from "@/src/components/Themed";
import { useNevkaProvider } from "@/src/providers/nevkaProvider";
import { Link, Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import Colors from "@/src/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native";

type PeopleData = {
    id: string,
    firstname: string,
    lastname: string,
    timestamp: string,
    online: string,
    avatar: string
};

type PeopleListItemProps = {
    user: PeopleData
}

const PeopleListItem = ({ user }: PeopleListItemProps) => {
    return (
        <Link href={{
            pathname: '/(tabs)/people/person',
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
                        <Text style={{ fontSize: 18 }}>{user.firstname + " " + user.lastname}</Text>
                        {user.online === 'online' && <Text style={{fontSize: 18, color: useColorScheme() === 'light' ? 'darkgreen' : 'lightgreen'}} numberOfLines={1}>{'Онлайн'}</Text>}
                        {user.online !== 'online' && <Text style={{fontSize: 16, color: useColorScheme() === 'light' ? 'darkslategray' : 'lightslategray'}} numberOfLines={1}>{'Был(а): ' + user.online}</Text>}
                    </View>
                    <Link href={{
                        pathname: '/(tabs)/messages/chat',
                        params: { id: user.id, name: user.firstname + " " + user.lastname }
                    }} withAnchor asChild>
                        <Pressable style={{height: '100%', justifyContent: 'center', marginRight: '3%'}}>
                            {({ pressed }) => (
                                <FontAwesome
                                name="envelope-o"
                                size={32}
                                color={Colors[useColorScheme() ?? 'light'].text}
                                style={{ opacity: pressed ? 0.5 : 1 }}
                                />
                            )}
                        </Pressable>
                    </Link>
                </View>
            </Pressable>
        </Link>
    );
}

export default function people () {
    const { token, loggedUser, isNameSet }: any = useNevkaProvider();
    if ( token == "") { return <Redirect href={'/'} /> };

    const isFocused = useIsFocused();
    const [update, setUpdate] = useState(0);
    const colorScheme = useColorScheme();
    const [peopleData, setPeopleData] = useState<PeopleData[]>();
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const inputStyle = colorScheme === 'light' ? styles.lightInput : styles.darkInput;

    const getPeople = async (query: string) => {
        const formData = new FormData();
        formData.append("query", query);
        formData.append("api-key", "qonxod-Kicmad-4puvhy");
        if (loggedUser == "1") formData.append("safe", "true");

        try {
            const response = await fetch('https://nevka.site/api/getPeople.php', {
                method: 'POST',
                body: formData
            });
            const json = await response.json();
            if (json.result == "failure") {
                console.log("getPeople error: " + json.error)
            } else if (json.result == "empty") {
                setPeopleData([]);
                console.log(json.error);
            } else if (json.result == "success") {
                json.people.pop();
                setPeopleData(json.people);
            }
        } catch (error) {
            console.log("Ошибка запроса людей, проблемы с соединением?\n" + error);
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        if (!isNameSet) {
            router.navigate("/settings");
        }
        if (isFocused) {
            setTimeout(() => setUpdate(update+1), 10000);
            getPeople(query);
        console.log("Updated: People");
        }
    }, [update, isFocused, query]);
    
    return (
        <View style={styles.container}>
            <TextInput style={inputStyle}
                value={query}
                onChangeText={setQuery}
                maxLength={63}
                spellCheck={false}
            ></TextInput>
            {loading ? <ActivityIndicator style={{flex: 1}}/> : <FlatList
                style={{flex: 1, width: '100%'}}
                data={peopleData}
                renderItem={({ item }) => <PeopleListItem user={item}/>}
                ListEmptyComponent={<Text style={{fontSize: 18, textAlign: 'center', margin: 15, color: colorScheme === 'light' ? 'darkslategray' : 'lightslategray'}}>Никого не найдено</Text>}
            />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    darkInput: {
        width: '94%',
        color: Colors.dark.text,
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        padding: '3%',
        borderRadius: 15,
        margin: '3%',
        fontSize: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.07)'
    },
    lightInput: {
        width: '94%',
        color: Colors.light.text,
        backgroundColor: 'rgba(0, 0, 0, 0.07)',
        padding: '3%',
        borderRadius: 15,
        margin: '3%',
        fontSize: 20,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.07)'
    },
});