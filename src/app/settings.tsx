import { Button, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, useColorScheme } from "react-native";
import { View, Text } from "@/src/components/Themed";
import { StatusBar } from "expo-status-bar";
import { useNevkaProvider } from "../providers/nevkaProvider";
import { Redirect } from "expo-router";
import Colors from "../constants/Colors";
import { useState } from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import * as AppConfig from "../../app.json";

export default function settings () {
    const { token, setToken }: any = useNevkaProvider();
    if ( token == "") { return <Redirect href={'/'} /> }
    const colorScheme = useColorScheme();

    const [firstname, setFirstname] = useState("");
    const [lasttname, setLastname] = useState("");
    const [city, setCity] = useState("");
    const [bio, setBio] = useState("");
    const [infoStatus, setInfoStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const headerHeight = useHeaderHeight();
    const inputStyle = colorScheme === 'light' ? styles.lightInput : styles.darkInput;
    const buttonStyle = colorScheme === 'light' ? styles.lightButton : styles.darkButton;
    const pressedColor = colorScheme === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)';
    
    return (
        <View style={styles.container}>
        <KeyboardAvoidingView style={{backgroundColor: colorScheme === 'light' ? Colors.light.background : Colors.dark.background, width: '100%'}}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={headerHeight}
            >
            <StatusBar style="light" />
            <ScrollView style={{width: '100%'}}>
                <Text style={{fontSize: 32, marginVertical: '7%', textAlign: 'center'}}>Настройки</Text>
                <Text style={{fontSize: 26, marginBottom: '3%' }}>Личная информация</Text>

                <Text style={styles.label}>Имя (обязательно):</Text>
                <TextInput style={inputStyle}
                    value={firstname}
                    onChangeText={setFirstname}
                    maxLength={63}
                    ></TextInput>
                <Text style={styles.label}>Фамилия (обязательно):</Text>
                <TextInput style={inputStyle}
                    value={lasttname}
                    onChangeText={setLastname}
                    maxLength={63}
                    ></TextInput>
                <Text style={styles.label}>Город:</Text>
                <TextInput style={inputStyle}
                    value={city}
                    onChangeText={setCity}
                    maxLength={63}
                    ></TextInput>
                <Text style={styles.label}>Информация:</Text>
                <TextInput style={inputStyle}
                    value={bio}
                    onChangeText={setBio}
                    maxLength={63}
                    ></TextInput>
                <Pressable
                    style={({pressed}) => [buttonStyle, { backgroundColor: pressed ? pressedColor : buttonStyle.backgroundColor }]}
                    // onPress={signIn}
                    disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Установка...' : 'Установить информацию'}</Text>
                </Pressable>
                <Text style={styles.console}>{infoStatus}</Text>

                <Text style={{fontSize: 26, marginVertical: '3%' }}>Аватар</Text>

                <Pressable
                    style={({pressed}) => [buttonStyle, { backgroundColor: pressed ? pressedColor : buttonStyle.backgroundColor }]}
                    onPress={() => setToken("")}
                    disabled={loading}>
                    <Text style={styles.buttonText}>Выйти из аккаунта</Text>
                </Pressable>

                <Text style={{fontSize: 18, alignSelf: 'center', color: colorScheme === 'light' ? 'darkslategray' : 'lightslategray'}}>Nevka Mobile v{AppConfig.expo.version}</Text>
                <Text style={{fontSize: 18, alignSelf: 'center', color: colorScheme === 'light' ? 'darkslategray' : 'lightslategray'}}>Авикус Делакруа</Text>
            </ScrollView>
        </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '3%'
    },
    console: {
        fontSize: 20,
        color: 'orange',
        textAlign: 'center'
    },
    label: {
        fontSize: 20,
        width: '90%',
        textAlign: 'left',
        marginVertical: 8
    },
    darkInput: {
        width: '100%',
        color: Colors.dark.text,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        padding: '3%',
        borderRadius: 15,
        // margin: '2%',
        fontSize: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)'
    },
    lightInput: {
        width: '100%',
        color: Colors.light.text,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        padding: '3%',
        borderRadius: 15,
        // margin: '2%',
        fontSize: 20,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.15)'
    },
    darkButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        width: '100%',
        // margin: '2%',
        marginVertical: '4%',
        borderRadius: 15,
        padding: '3%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)'
    },
    lightButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        width: '100%',
        // margin: '2%',
        marginVertical: 20,
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