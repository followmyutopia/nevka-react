import { Button, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, useColorScheme } from "react-native";
import { View, Text } from "@/src/components/Themed";
import { StatusBar } from "expo-status-bar";
import { useNevkaProvider } from "../providers/nevkaProvider";
import { Redirect } from "expo-router";
import { useState } from "react";
import Colors from "../constants/Colors";
import { useHeaderHeight } from "@react-navigation/elements";
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function settings () {
    const { token, setToken }: any = useNevkaProvider();
    if ( token == "") { return <Redirect href={'/'} /> }

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("123");
    const [imageStatus, setImageStatus] = useState("Можно добавить изображение");
    const colorScheme = useColorScheme();
    const headerHeight = useHeaderHeight();
    const inputStyle = colorScheme === 'light' ? styles.lightInput : styles.darkInput;
    const buttonStyle = colorScheme === 'light' ? styles.lightButton : styles.darkButton;
    const pressedColor = colorScheme === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)';
    const [image, setImage] = useState("");

    const pickImage = async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
                base64: true
                //   allowsEditing: true,
                //   aspect: [4, 3],
                //   quality: 1,
            });
        
            if (!result.canceled) {
                setImage('data:' + result.assets[0].mimeType + ';base64,' + result.assets[0].base64);
                setImageStatus("Выбран файл: " + result.assets[0].fileName);
                // need to delete the file from the cache, wtf
            }
        };
    
        const resetImage = () => {
            setImage("");
            setImageStatus("Файл откреплён!");
        };
    
    return (
        <View style={styles.container}>
            <KeyboardAvoidingView style={[styles.container, {backgroundColor: colorScheme === 'light' ? Colors.light.background : Colors.dark.background}]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={headerHeight}
            >
                <StatusBar style="light" />
                <Text style={{fontSize: 32, marginVertical: '7%'}}>Написать на стене</Text>
                <Text style={styles.label}>Пост:</Text>
                <TextInput
                    multiline
                    enterKeyHint='send'
                    style={inputStyle}
                    value={message}
                    onChangeText={setMessage}
                    maxLength={1023}
                    submitBehavior='submit'
                    // onSubmitEditing={sendTopicReply}
                ></TextInput>
                <View style={{flexDirection: 'row', marginHorizontal: '3%'}}>
                    {image === "" ? <Pressable style={{justifyContent: 'center', alignItems: 'flex-start', margin: '3%'}}
                    onPress={pickImage}>
                        {({ pressed }) => (
                            <FontAwesome
                            name="picture-o"
                            size={27}
                            color={Colors[useColorScheme() ?? 'light'].text}
                            style={{ opacity: pressed ? 0.5 : 1 }}
                            />
                        )}
                    </Pressable> : <Pressable style={{justifyContent: 'center', alignItems: 'flex-start', margin: '3%', paddingHorizontal: 1}}
                    onPress={resetImage}>
                        {({ pressed }) => (
                            <FontAwesome
                            name="window-close-o"
                            size={27}
                            color={Colors[useColorScheme() ?? 'light'].text}
                            style={{ opacity: pressed ? 0.5 : 1 }}
                            />
                        )}
                    </Pressable>}
                    <Text style={{
                        color: colorScheme === 'light' ? 'darkslategray' : 'lightslategray',
                        fontSize: 17,
                        flex: 1,
                        justifyContent: 'center',
                        alignContent: 'center',
                        marginVertical: '5%'
                    }}>{imageStatus}</Text>
                </View>
                <Pressable
                    style={({pressed}) => [buttonStyle, { backgroundColor: pressed ? pressedColor : buttonStyle.backgroundColor }]}
                    // onPress={signIn}
                    disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Публикация...' : 'Опубликовать'}</Text>
                </Pressable>
                <Text style={styles.console}>{status}</Text>
            </KeyboardAvoidingView>
            <View style={{flex: 0.25}}></View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    console: {
        fontSize: 20,
        color: 'orange',
        marginVertical: '2.5%',
        textAlign: 'center'
    },
    label: {
        fontSize: 20,
        width: '90%',
        textAlign: 'left'
    },
    darkInput: {
        width: '90%',
        height: '15%',
        color: Colors.dark.text,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        padding: '3%',
        borderRadius: 15,
        margin: '2%',
        fontSize: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    lightInput: {
        width: '90%',
        height: '15%',
        color: Colors.light.text,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        padding: '3%',
        borderRadius: 15,
        margin: '2%',
        fontSize: 20,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.15)',
    },
    darkButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        width: '90%',
        margin: '2%',
        borderRadius: 15,
        padding: '3%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)'
    },
    lightButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        width: '90%',
        margin: '2%',
        borderRadius: 15,
        padding: '3%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.15)'
    },
    buttonText: {
        fontSize: 20
    }
});