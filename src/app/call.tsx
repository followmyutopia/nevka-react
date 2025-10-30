import { View, StyleSheet, Text, useColorScheme, Image, Pressable } from "react-native";
import Colors from "../constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function Call() {
    const colorScheme = useColorScheme();
    const isFocused = useIsFocused();
    const { user } = useLocalSearchParams<{ user?: string }>();
    let userObj: any = JSON.parse(decodeURIComponent(user!));

    useEffect(() => {
        if (isFocused) {
            // perform all operations only if screen is focused
        }

        return () => {
            // on screen close, finish the call
        };
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: colorScheme === 'light' ? Colors.light.background : Colors.dark.background, width: '100%' }]}>
            <Text style={{
                fontSize: 34,
                color: colorScheme === 'light' ? Colors.light.text : Colors.dark.text,
                textAlign: 'center',
                marginBottom: 10
            }}>{userObj.firstname + " " + userObj.lastname}</Text>
            <Text style={{
                fontSize: 20,
                color: colorScheme === 'light' ? Colors.light.text : Colors.dark.text,
                textAlign: 'center',
                marginBottom: 20
            }}>Вызов невозможен{`\n\n`}Звонки находятся в разработке, будут доступны начиная с версии 1.5</Text>
            <Image style={{
                width: '90%',
                aspectRatio: 1,
                borderRadius: 50,
                borderWidth: 1,
                marginBottom: 20,
                borderColor: useColorScheme() === 'light' ? Colors.light.borders : Colors.dark.borders
            }}
                source={{ uri: userObj.avatar }}></Image>
            <Pressable
                style={({ pressed }) => [useColorScheme() === 'light' ? styles.lightRoundButton : styles.darkRoundButton, { backgroundColor: pressed ? "rgba(128, 0, 0, 1)" : "rgba(192, 0, 0, 1)" }]}
                onPress={() => router.back()}
            >
                <FontAwesome
                    name="phone"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ transform: [{ rotate: '135deg' }] }}
                />
            </Pressable>
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
    darkRoundButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        width: 75,
        height: 75,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.borders,
        // marginVertical: '3%'
    },
    lightRoundButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        width: 75,
        height: 75,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.light.borders,
        // marginVertical: '3%'
    },


    console: {
        fontSize: 20,
        color: 'orange',
        textAlign: 'center'
    },
    label: {
        fontSize: 20,
        textAlign: 'left',
        marginVertical: 8
    },
    text: {
        fontSize: 20,
        marginHorizontal: 15,
        textAlign: 'center',
        marginVertical: 8
    },
    darkInput: {
        width: '100%',
        color: Colors.dark.text,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        padding: '3%',
        borderRadius: 25,
        fontSize: 20,
        borderWidth: 1,
        borderColor: Colors.dark.borders
    },
    lightInput: {
        width: '100%',
        color: Colors.light.text,
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        padding: '3%',
        borderRadius: 25,
        fontSize: 20,
        borderWidth: 1,
        borderColor: Colors.light.borders
    },
    darkButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        width: '100%',
        marginVertical: '4%',
        borderRadius: 25,
        padding: '3%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.borders
    },
    lightButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        width: '100%',
        marginVertical: '4%',
        borderRadius: 25,
        padding: '3%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.light.borders
    },
    buttonText: {
        fontSize: 20
    }
});