import { ActivityIndicator, Button, StyleSheet } from "react-native";
import { View, Text } from "@/src/components/Themed";
import { useEffect, useState } from "react";
import { useNevkaProvider } from "@/src/providers/nevkaProvider";
import { Redirect } from "expo-router";

type UserData = {
    firstname: string,
    lastname: string,
    status: string,
    city: string,
    bio: string,
    timestamp: number,
    avatar: Blob
};

export default function profile () {
    const { token, loggedUser }: any = useNevkaProvider();
    if ( token == "") { return <Redirect href={'/'} /> }

    const [userData, setUserData] = useState<UserData>();
    const [loading, setLoading] = useState(true);

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
                // TODO
            } else if (json.result == "success") {
                setUserData(json);
            }
        } catch (error) {
            console.log("Ошибка API запроса, обновите приложение");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUserData(loggedUser);
    });

    return (
        <View style={styles.container}>
            <Text>{loading ? <ActivityIndicator /> : userData!.firstname}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});