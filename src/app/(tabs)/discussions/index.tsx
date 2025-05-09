import { ActivityIndicator, FlatList, Pressable, StyleSheet, TextInput, useColorScheme } from "react-native";
import { View, Text } from "@/src/components/Themed";
import { useNevkaProvider } from "@/src/providers/nevkaProvider";
import { Link, Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import Colors from "@/src/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native";

type DiscData = {
    id: string,
    topic: string,
    name: string,
    message: string,
    timestamp: string,
    formattedTime: string
};

type DiscListItemProps = {
    item: DiscData
}

const DiscListItem = ({ item }: DiscListItemProps) => {
    return (
        <Link href={{
            pathname: '/(tabs)/discussions/topic',
            params: { id: item.id }
            }} asChild>
            <Pressable style={{ width: '100%', paddingHorizontal: '3%', paddingVertical: '2%' }}>
                <View style={{flexDirection: 'row', height: 70 }}>
                    <FontAwesome
                        name="comments-o"
                        size={50}
                        color={Colors[useColorScheme() ?? 'light'].text}
                        style={{ height: '100%', width: 70, padding: 10 }}
                    />
                    <View style={{ flexDirection: 'column', justifyContent: 'space-around', height: '100%', padding: '2%', paddingLeft: '4%', flex: 1 }}>
                        <Text style={{fontSize: 18, color: useColorScheme() === 'light' ? 'darkslategray' : 'lightslategray'}} numberOfLines={1}>Тема: <Text style={{ fontSize: 18 }}>{item.topic}</Text></Text>
                        <Text style={{fontSize: 18, color: useColorScheme() === 'light' ? 'darkslategray' : 'lightslategray'}} numberOfLines={1}>Автор: {item.name}</Text>
                    </View>
                </View>
            </Pressable>
        </Link>
    );
}

export default function discussions () {
    const { token, isNameSet }: any = useNevkaProvider();
    if ( token == "") { return <Redirect href={'/'} /> };

    const isFocused = useIsFocused();
    const [update, setUpdate] = useState(0);
    const [discData, setDiscData] = useState<DiscData[]>();
    const colorScheme = useColorScheme();
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const inputStyle = colorScheme === 'light' ? styles.lightInput : styles.darkInput;

    const getDiscussions = async (query: string) => {
        const formData = new FormData();
        formData.append("query", query);
        formData.append("api-key", "qonxod-Kicmad-4puvhy");

        try {
            const response = await fetch('https://nevka.site/api/getDiscussions.php', {
                method: 'POST',
                body: formData
            });
            const json = await response.json();
            if (json.result == "failure") {
                console.log("getDiscussions error: " + json.error)
            } else if (json.result == "empty") {
                setDiscData([]);
                console.log(json.error);
            } else if (json.result == "success") {
                json.discussions.pop();
                setDiscData(json.discussions);
            }
        } catch (error) {
            console.log("Ошибка запроса обсуждений, проблемы с соединением?\n" + error);
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
            getDiscussions(query);
            console.log("Updated: Discussions");
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
            {loading ? <ActivityIndicator /> : <FlatList
                style={{flex: 1, width: '100%'}}
                data={discData}
                renderItem={({ item }) => <DiscListItem item={item}/>}
                ListEmptyComponent={<Text style={{fontSize: 18, textAlign: 'center', margin: 15, color: colorScheme === 'light' ? 'darkslategray' : 'lightslategray'}}>Обсуждений не найдено</Text>}
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
        width: '94%',
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