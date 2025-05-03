import { Button, ScrollView, StyleSheet, useColorScheme } from "react-native";
import { View, Text } from "@/src/components/Themed";
import { StatusBar } from "expo-status-bar";
import { useNevkaProvider } from "../providers/nevkaProvider";
import { Redirect } from "expo-router";
import Colors from "../constants/Colors";

export default function settings () {
    const { token, setToken }: any = useNevkaProvider();
    if ( token == "") { return <Redirect href={'/'} /> }
    const colorScheme = useColorScheme();
    
    return (
        <ScrollView style={[styles.container, {backgroundColor: colorScheme === 'light' ? Colors.light.background : Colors.dark.background}]}>
            <StatusBar style="light" />
            <Text style={{fontSize: 32, marginVertical: '7%', textAlign: 'center'}}>Настройки</Text>
            <Text style={{fontSize: 26 }}>Личная информация</Text>


            {/* <Button title="Logout" onPress={() => setToken("")}/> */}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: '3%',
        width: '100%'
    },
});