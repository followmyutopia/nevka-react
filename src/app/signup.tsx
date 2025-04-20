import { StyleSheet, TextInput, useColorScheme, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { Text } from "../components/Themed"
import Colors from "../constants/Colors";
import { useNevkaProvider } from "../providers/nevkaProvider";
import { Redirect } from "expo-router";

export default function signup () {
    const colorScheme = useColorScheme();
    const inputStyle = colorScheme === 'light' ? styles.lightInput : styles.darkInput;
    const buttonStyle = colorScheme === 'light' ? styles.lightButton : styles.darkButton;
    const pressedColor = colorScheme === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)';

    const { token }: any = useNevkaProvider();
    if ( token != "") { return <Redirect href={'/(tabs)/profile'} /> }

    return (
        <KeyboardAvoidingView style={[styles.container, {backgroundColor: colorScheme === 'light' ? Colors.light.background : Colors.dark.background}]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        

        <Text style={styles.label}>Электронная почта:</Text>
        <TextInput style={inputStyle}></TextInput>

        <Pressable style={({pressed}) => [buttonStyle, { backgroundColor: pressed ? pressedColor : buttonStyle.backgroundColor }]}>
            <Text style={styles.buttonText}>Выслать код подтверждения</Text>
        </Pressable>

        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    label: {
        fontSize: 20,
        width: '90%',
        textAlign: 'left'
    },
    console: {
        fontSize: 20,
        color: 'orange',
        marginTop: '2.5%'
    },
    darkInput: {
        width: '90%',
        color: Colors.dark.text,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        padding: '3%',
        borderRadius: 10,
        margin: '2%',
        fontSize: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)'
    },
    lightInput: {
        width: '90%',
        color: Colors.light.text,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        padding: '3%',
        borderRadius: 10,
        margin: '2%',
        fontSize: 20,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.15)'
    },
    darkButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        width: '90%',
        margin: '2%',
        borderRadius: 10,
        padding: '3%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)'
    },
    lightButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        width: '90%',
        margin: '2%',
        borderRadius: 10,
        padding: '3%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.15)'
    },
    buttonText: {
        fontSize: 20
    }
});