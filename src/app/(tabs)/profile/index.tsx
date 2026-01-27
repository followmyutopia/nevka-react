/**
 * Nevka Mobile v1.6
 * 2025 Avicus Delacroix
 */

import { ActivityIndicator, StyleSheet, Image, useColorScheme, FlatList, Pressable } from "react-native";
import FullWidthImage from 'react-native-fullwidth-image'
import { View, Text } from "@/src/components/Themed";
import { useEffect, useState, useRef } from "react";
import { useNevkaProvider } from "@/src/providers/nevkaProvider";
import { Redirect, router, Stack } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import Dialog from "react-native-dialog";
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "@/src/constants/Colors";
import { AppState } from "react-native";
import * as AppConfig from "../../../../app.json"

type UserData = {
    id: string,
    firstname: string,
    lastname: string,
    status: string,
    city: string,
    bio: string,
    timestamp: number,
    avatar: string,
    online: string,
    push_token: string,
    vox_username: string
};

type WallData = {
    id: string,
    text: string,
    image: string,
    timestamp: string,
    formattedTime: string,
    likes: string,
    author: string
};

type MyInfoScreenProps = {
    user: UserData;
    onStatusChange: () => void;
}

type WallPostProps = {
    item: WallData,
    user: UserData,
    deleteHandler: (id: any) => void,
    likeHandler: (id: any) => void
}

const MyInfoScreen = ({ user, onStatusChange }: MyInfoScreenProps) => {
    const colorScheme = useColorScheme();
    return (
        <View style={{ width: '100%', padding: '3%' }}>
            <View style={{ flexDirection: 'row', height: 150, paddingBottom: '4%' }}>
                <Image style={{
                    height: '100%',
                    aspectRatio: 1,
                    borderRadius: 40,
                    borderWidth: 1,
                    borderColor: useColorScheme() === 'light' ? Colors.light.borders : Colors.dark.borders
                }}
                    source={{ uri: user.avatar }}></Image>
                <View style={{ flexDirection: 'column', justifyContent: 'space-around', height: '80%', paddingLeft: '4%' }}>
                    <Text style={{ fontSize: 32 }}>{user.firstname}</Text>
                    <Text style={{ fontSize: 32, paddingBottom: 10 }}>{user.lastname}</Text>
                    {user.online === 'online' && <Text style={{ fontSize: 18, color: useColorScheme() === 'light' ? 'darkgreen' : 'lightgreen' }}>{'\nОнлайн'}</Text>}
                    {user.online !== 'online' && <Text style={{ fontSize: 18, color: useColorScheme() === 'light' ? 'darkslategray' : 'lightslategray' }}>{'Был(а) в сети:\n' + user.online}</Text>}
                </View>
            </View>
            {user.status != "" ? <Text style={{
                fontSize: 18,
                textAlign: 'center',
                paddingBottom: '2%',
                paddingHorizontal: '4%'
            }}>{user.status}</Text> : null}
            <Pressable style={{ alignItems: 'center' }} onPress={onStatusChange}><Text style={{
                fontSize: 18,
                color: useColorScheme() === 'light' ? 'darkslategray' : 'lightslategray',
                marginBottom: '4%'
            }}>Установить статус</Text></Pressable>
            {user.city != "" || user.bio != "" ? <View style={{
                borderColor: useColorScheme() === 'light' ? Colors.light.borders : Colors.dark.borders,
                borderRadius: 25,
                borderWidth: 1,
                padding: 15,
                marginBottom: '6%',
                gap: 10
            }}>
                {user.city != "" ? <Text style={{ fontSize: 18, }}>Город: {user.city}</Text> : null}
                {user.bio != "" ? <Text style={{ fontSize: 18 }}>Информация: {user.bio}</Text> : null}
            </View> : null}
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <Pressable
                    style={({ pressed }) => [useColorScheme() === 'light' ? styles.lightRoundButton : styles.darkRoundButton, { backgroundColor: pressed ? useColorScheme() === 'light' ? 'rgba(0, 0, 0, 0.11)' : 'rgba(255, 255, 255, 0.11)' : useColorScheme() === 'light' ? styles.lightButton.backgroundColor : styles.darkButton.backgroundColor }]}
                    onPress={() => router.navigate('/create-wall')}
                >
                    <FontAwesome
                        name="pencil-square-o"
                        size={25}
                        color={Colors[(colorScheme === 'dark' ? 'dark' : 'light')].text}
                        style={{ marginLeft: 4 }}
                    />
                </Pressable>
                <Pressable
                    style={({ pressed }) => [useColorScheme() === 'light' ? styles.lightRoundButton : styles.darkRoundButton, { backgroundColor: pressed ? useColorScheme() === 'light' ? 'rgba(0, 0, 0, 0.11)' : 'rgba(255, 255, 255, 0.11)' : useColorScheme() === 'light' ? styles.lightButton.backgroundColor : styles.darkButton.backgroundColor }]}
                    onPress={() => router.navigate('/settings')}
                >
                    <FontAwesome
                        name="cog"
                        size={25}
                        color={Colors[(colorScheme === 'dark' ? 'dark' : 'light')].text}
                        style={{ margin: 0 }}
                    />
                </Pressable>
            </View>
        </View>
    );
}

const WallPost = ({ item, user, deleteHandler, likeHandler }: WallPostProps) => {
    const likesArray = JSON.parse(item.likes);
    const colorScheme = useColorScheme();
    const swipeableRef = useRef<any>(null);

    const renderRightActions = (deleteHandler: any) => {
        return (
            <Pressable style={{
                justifyContent: 'center',
                alignItems: 'center',
                margin: '3%',
                marginRight: '6%'
            }}
                onPress={deleteHandler}>
                {({ pressed }) => (
                    <FontAwesome
                        name="trash-o"
                        size={35}
                        color='crimson'
                        style={{ opacity: pressed ? 0.5 : 1 }}
                    />
                )}
            </Pressable>
        );
    };

    return (
        <Swipeable
            renderRightActions={() => renderRightActions(() => deleteHandler(item.id))}
            ref={swipeableRef}
        >
            <View style={{
                width: '94%',
                margin: '3%',
                borderColor: useColorScheme() === 'light' ? Colors.light.borders : Colors.dark.borders,
                borderRadius: 25,
                borderWidth: 1,
                padding: 15,
            }}>

                <View style={{
                    flexDirection: 'row', height: 50, paddingBottom: '2%',
                }}>
                    <Image style={{
                        height: '100%',
                        aspectRatio: 1,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: useColorScheme() === 'light' ? Colors.light.borders : Colors.dark.borders
                    }}
                        source={{ uri: user.avatar }}>
                    </Image>
                    <View style={{ flexDirection: 'column', justifyContent: 'space-around', height: '100%', paddingLeft: '2%' }}>
                        <Text style={{ fontSize: 18 }}>{user.firstname} {user.lastname}</Text>
                        <Text style={{ fontSize: 18, color: useColorScheme() === 'light' ? 'darkslategray' : 'lightslategray' }}>{item.formattedTime}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'column' }}>
                    {item.text != "" ? <Text style={{ fontSize: 18 }}>{item.text}</Text> : null}
                    {item.image != "" ? <FullWidthImage style={{
                        width: '100%',
                        borderRadius: 10,
                        marginTop: 10,
                        borderWidth: 1,
                        borderColor: useColorScheme() === 'light' ? Colors.light.borders : Colors.dark.borders
                    }}
                        source={{ uri: item.image }}>
                    </FullWidthImage> : null}
                </View>
                <View style={{
                    flexDirection: 'row',
                    marginTop: '3%',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                }}>
                    <Pressable style={{
                        flexDirection: 'row',
                        borderColor: useColorScheme() === 'light' ? Colors.light.borders : Colors.dark.borders,
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
                                    color={likesArray.includes(parseInt(user.id)) ? 'crimson' : Colors[(colorScheme === 'dark' ? 'dark' : 'light')].text}
                                    style={{ opacity: pressed ? 0.5 : 1 }} />
                                {likesArray.length != 0 ? <Text style={{
                                    fontSize: 15,
                                    marginLeft: 10
                                }}>{likesArray.length}</Text> : null}
                            </>
                        )}
                    </Pressable>
                    <View style={{ flex: 1 }}></View>
                </View>
            </View>
        </Swipeable>
    );
}

export default function profile() {
    const { token, setToken, loggedUser, setIsNameSet, notificationStatus, setNotificationStatus, voxLogin, voxUsername, setVoxUsername, voxLogged, setVoxLogged, latestVersion, setLatestVersion }: any = useNevkaProvider();
    if (token == "") { return <Redirect href={'/'} /> };

    const isFocused = useIsFocused();
    const [update, setUpdate] = useState(0);
    const [userData, setUserData] = useState<UserData>();
    const [wallData, setWallData] = useState<WallData[]>([]);
    const [loading, setLoading] = useState(true);
    const [wallLoading, setWallLoading] = useState(true);
    const [newStatus, setNewStatus] = useState("");
    const [showStatusEditor, setShowStatusEditor] = useState(false);
    const [showDeletePostDialog, setShowDeletePostDialog] = useState(false);
    const [postToDelete, setPostToDelete] = useState("");
    const [expoGoLink, setExpoGoLink] = useState("");

    const colorScheme = useColorScheme();
    const appState = useRef(AppState.currentState);

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
                if (json.firstname == "" || json.lastname == "") {
                    setIsNameSet(false);
                    router.navigate("/settings");
                } else {
                    setLoading(false);
                    setUserData(json);
                    if (!voxLogged) {
                        voxLogin(json.vox_username);
                        setVoxLogged(true);
                    }
                }
                if (json.push_token == "" && notificationStatus != "prompted") {
                    setNotificationStatus("suggest");
                }
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

    const setStatus = async () => {
        setShowStatusEditor(false)
        let status = newStatus.trim();

        const formData = new FormData();
        formData.append("token", token);
        formData.append("status", status);
        formData.append("api-key", "qonxod-Kicmad-4puvhy");

        try {
            const response = await fetch('https://nevka.site/api/setStatus.php', {
                method: 'POST',
                body: formData
            });
            const json = await response.json();
            if (json.result == "failure") {
                if (json.error == "wrong_token") {
                    setToken("");
                }
                console.log("setUserData error: " + json.error)
            } else if (json.result == "success") {
                setUpdate(0);
                setNewStatus("");
            }
        } catch (error) {
            console.log("Ошибка установки статуса, проблемы с соединением?\n" + error);
        }
    }

    const showDeleteDialog = (id: string) => {
        setShowDeletePostDialog(true);
        setPostToDelete(id);
    }

    const deletePost = async () => {
        setShowDeletePostDialog(false);

        const formData = new FormData();
        formData.append("token", token);
        formData.append("postId", postToDelete);
        formData.append("api-key", "qonxod-Kicmad-4puvhy");

        try {
            const response = await fetch('https://nevka.site/api/deletePost.php', {
                method: 'POST',
                body: formData
            });
            const json = await response.json();
            if (json.result == "failure") {
                if (json.error == "wrong_token") {
                    setToken("");
                }
                console.log("deletePost error: " + json.error)
            } else if (json.result == "success") {
                getWall(loggedUser);
            }
        } catch (error) {
            console.log("Ошибка удаления записи, проблемы с соединением?\n" + error);
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
                getWall(loggedUser);
            }
        } catch (error) {
            console.log("Ошибка лайка записи, проблемы с соединением?\n" + error);
        }
    }

    // const checkUpdate = async () => {
    //     try {
    //         const response = await fetch('https://nevka.site/api/checkUpdate.php');
    //         const json = await response.json();
    //         setLatestVersion(json.latestVersion);
    //         setExpoGoLink(json.expoGo);

    //         if (AppConfig.expo.version != latestVersion) {
    //             console.log("Outdated version!!!");
    //         }
    //     } catch (error) {
    //         console.log("Ошибка запроса последней версии, проблемы с соединением?\n" + error);
    //     }
    // }

    useEffect(() => {
        if (isFocused) {
            setTimeout(() => setUpdate(update + 1), 5000);
            getUserData(loggedUser);
            console.log("Updated: UserData for: " + loggedUser);
            getWall(loggedUser);
            console.log("Updated: Wall for: " + loggedUser);
            // checkUpdate();
        }
    }, [update, isFocused]);

    useEffect(() => {
        const subscription = AppState.addEventListener("change", nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === "active") {
                setVoxLogged(false);
                getUserData(loggedUser);
            }
            appState.current = nextAppState;
        });

        if (!voxLogged) getUserData(loggedUser);

        return () => {
            subscription.remove();
        };
    }, [appState.current, voxLogged]);

    return (
        <View style={styles.container}>
            {loading ? <ActivityIndicator style={{ flex: 1 }} /> : <FlatList
                ListHeaderComponent={<MyInfoScreen user={userData!} onStatusChange={() => setShowStatusEditor(true)} />}
                ListFooterComponent={<View style={{ height: 80 }}></View>}
                style={{ flex: 1, width: '100%' }}
                data={wallData || <ActivityIndicator />}
                renderItem={({ item }) => <WallPost item={item} user={userData!} deleteHandler={showDeleteDialog} likeHandler={likePost} />}
                ListEmptyComponent={<Text style={{ fontSize: 18, textAlign: 'center', margin: 15, color: colorScheme === 'light' ? 'darkslategray' : 'lightslategray' }}>Записей на стене нет</Text>}
            />}
            <Dialog.Container visible={showStatusEditor}>
                <Dialog.Title>Введите новый статус:</Dialog.Title>
                <Dialog.Input value={newStatus}
                    onChangeText={setNewStatus}
                    maxLength={127} />
                <Dialog.Button label="Отменить" onPress={() => setShowStatusEditor(false)} />
                <Dialog.Button label="Установить" onPress={setStatus} />
            </Dialog.Container>
            <Dialog.Container visible={showDeletePostDialog}>
                <Dialog.Title>Удалить запись?</Dialog.Title>
                <Dialog.Button label="Отменить" onPress={() => setShowDeletePostDialog(false)} />
                <Dialog.Button label="Удалить" onPress={() => deletePost()} />
            </Dialog.Container>
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
        borderColor: Colors.dark.borders
    },
    lightButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        borderRadius: 25,
        padding: '3%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.light.borders,
    },
    buttonText: {
        fontSize: 20
    },
    darkRoundButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.borders,
    },
    lightRoundButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.light.borders,
    }
});