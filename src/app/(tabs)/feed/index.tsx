import Colors from "@/src/constants/Colors";
import { useNevkaProvider } from "@/src/providers/nevkaProvider";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native";
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import { useColorScheme, View, Image, Text, Pressable, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import FullWidthImage from "react-native-fullwidth-image";

type WallData = {
    id: string,
    text: string,
    image: string,
    timestamp: string,
    formattedTime: string,
    likes: string,
    author: string,
    authorName: string,
    authorAvatar: string
};

type WallPostProps = {
    item: WallData,
    likeHandler: (id: any) => void,
    me: string
}

const WallPost = ({ item, likeHandler, me }: WallPostProps) => {
    const likesArray = JSON.parse(item.likes);
    const colorScheme = useColorScheme();

    return (
        <View style={{
            width: '94%',
            margin: '3%',
            borderColor: colorScheme === 'light' ? Colors.light.borders : Colors.dark.borders,
            borderRadius: 25,
            borderWidth: 1,
            padding: 15,
        }}>

            <View style={{
                flexDirection: 'row', height: 50, paddingBottom: '2%'
            }}>
                <Image style={{
                    height: '100%',
                    aspectRatio: 1,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colorScheme === 'light' ? Colors.light.borders : Colors.dark.borders
                }}
                    source={{ uri: item.authorAvatar }}>
                </Image>
                <View style={{ flexDirection: 'column', justifyContent: 'space-around', height: '100%', paddingLeft: '2%' }}>
                    <Text style={{ fontSize: 18, color: colorScheme === 'light' ? Colors.light.text : Colors.dark.text }}>{item.authorName}</Text>
                    <Text style={{ fontSize: 18, color: colorScheme === 'light' ? 'darkslategray' : 'lightslategray' }}>{item.formattedTime}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'column' }}>
                {item.text != "" ? <Text style={{ fontSize: 18, color: colorScheme === 'light' ? Colors.light.text : Colors.dark.text }}>{item.text}</Text> : null}
                {item.image != "" ? <FullWidthImage style={{
                    width: '100%',
                    borderRadius: 10,
                    marginTop: 10,
                    borderWidth: 1,
                    borderColor: colorScheme === 'light' ? Colors.light.borders : Colors.dark.borders
                }}
                    source={{ uri: item.image }}>
                </FullWidthImage> : null}
                <View style={{
                    flexDirection: 'row',
                    marginTop: '3%',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                }}>
                    {Array.isArray(likesArray) ? <Pressable style={{
                        flexDirection: 'row',
                        borderColor: colorScheme === 'light' ? Colors.light.borders : Colors.dark.borders,
                        borderRadius: 25,
                        borderWidth: 1,
                        padding: '3%',
                    }}
                        onPress={() => likeHandler(item.id)}>
                        {({ pressed }) => (
                            <>
                                <FontAwesome
                                    name="heart"
                                    size={18}
                                    color={likesArray.includes(parseInt(me)) ? 'crimson' : Colors[colorScheme ?? 'light'].text}
                                    style={{ opacity: pressed ? 0.5 : 1 }} />
                                {likesArray.length > 0 ? <Text style={{
                                    fontSize: 15,
                                    marginLeft: 10,
                                    color: colorScheme === 'light' ? Colors.light.text : Colors.dark.text
                                }}>{likesArray.length}</Text> : null}
                            </>
                        )}
                    </Pressable> : <View style={{
                        flexDirection: 'row',
                        borderColor: colorScheme === 'light' ? Colors.light.borders : Colors.dark.borders,
                        borderRadius: 25,
                        borderWidth: 1,
                        padding: '3%',
                    }}><FontAwesome
                            name="heart"
                            size={18}
                            color={Colors[colorScheme ?? 'light'].text}
                        />
                        <ActivityIndicator size={15} style={{
                            marginLeft: 10
                        }} />
                    </View>}
                    <View style={{ flex: 1 }}></View>
                </View>
            </View>

        </View>
    );
}

export default function feed() {
    const { token, setToken, loggedUser }: any = useNevkaProvider();
    if (token == "") { return <Redirect href={'/'} /> };

    const [feedData, setFeedData] = useState<WallData[]>([]);
    const [feedLoading, setFeedLoading] = useState(true);
    const [page, setPage] = useState<number>(1);
    const [update, setUpdate] = useState(0);
    const colorScheme = useColorScheme();
    const isFocused = useIsFocused();

    const getFeed = async (pageId: number) => {
        const formData = new FormData();
        formData.append("page", pageId.toString());
        formData.append("api-key", "qonxod-Kicmad-4puvhy");
        setFeedLoading(true);

        try {
            const response = await fetch('https://nevka.site/api/getFeed.php', {
                method: 'POST',
                body: formData
            });
            const json = await response.json();
            if (json.result == "failure") {
                console.log("getFeed error: " + json.error)
            } else if (json.result == "empty") {
                setFeedData([]);
            } else if (json.result == "success") {
                json.feed.pop();
                setFeedData(json.feed);
            }
        } catch (error) {
            console.log("Ошибка запроса стены, проблемы с соединением?\n" + error);
        } finally {
            setFeedLoading(false);
        }
    }

    const likePost = async (postId: string) => {
        const formData = new FormData();
        formData.append("token", token);
        formData.append("postId", postId);
        formData.append("api-key", "qonxod-Kicmad-4puvhy");

        try {
            const response = await fetch('https://nevka.site/api/likePost.php', {
                method: 'POST',
                body: formData
            });
            const json = await response.json();
            if (json.result == "failure") {
                if (json.error == "wrong_token") {
                    setToken("");
                }
                console.log("likePost error: " + json.error)
            } else if (json.result == "success") {
                setFeedData(feedData.map(item =>
                    item.id === postId
                        ? { ...item, likes: '{}' } // update the property
                        : item                        // keep others unchanged
                )
                );
                getFeed(page);
            }
        } catch (error) {
            console.log("Ошибка лайка записи, проблемы с соединением?\n" + error);
        }
    }

    useEffect(() => {
        if (isFocused) {
            setTimeout(() => setUpdate(update + 1), 10000);
            getFeed(page);
            console.log("Updated: Feed, pages: " + page);
        }
    }, [update, isFocused]);

    return (
        <View style={[styles.container, { backgroundColor: colorScheme === 'light' ? Colors.light.background : Colors.dark.background }]}>
            <FlatList
                ListHeaderComponent={<Pressable
                    style={({ pressed }) => [useColorScheme() === 'light' ? styles.lightButton : styles.darkButton, { backgroundColor: pressed ? useColorScheme() === 'light' ? 'rgba(0, 0, 0, 0.11)' : 'rgba(255, 255, 255, 0.11)' : useColorScheme() === 'light' ? styles.lightButton.backgroundColor : styles.darkButton.backgroundColor }]}
                    onPress={() => router.navigate('/create-wall')}
                >
                    <Text style={{ fontSize: 20, color: colorScheme === 'light' ? Colors.light.text : Colors.dark.text }}>Написать пост</Text>
                </Pressable>}
                ListFooterComponent={feedLoading ? <ActivityIndicator style={{ marginTop: 20, marginBottom: 120 }} /> : <View style={{ height: 80 }}></View>}
                style={{ flex: 1, width: '100%' }}
                data={feedData || <ActivityIndicator />}
                renderItem={({ item }) => <WallPost item={item} likeHandler={likePost} me={loggedUser} />}
                onEndReached={() => {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    getFeed(nextPage);
                    console.log("Requested: Feed, pages: " + nextPage);
                }}
                onEndReachedThreshold={2}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    darkButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: 25,
        padding: '3%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.borders,
        margin: '3%'
    },
    lightButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        borderRadius: 25,
        padding: '3%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.light.borders,
        margin: '3%'
    },
    darkRoundButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.borders
    },
    lightRoundButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.light.borders
    },
    buttonText: {
        fontSize: 20
    }
});