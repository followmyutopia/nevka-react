import { ScrollView, Text, StyleSheet, useColorScheme, Pressable, View } from "react-native";
import Colors from "../constants/Colors";
import { router } from "expo-router";


export default function agreement() {
    const colorScheme = useColorScheme();
    const buttonStyle = colorScheme === 'light' ? styles.lightButton : styles.darkButton;
    const pressedColor = colorScheme === 'light' ? 'rgba(0, 0, 0, 0.11)' : 'rgba(255, 255, 255, 0.11)';

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ backgroundColor: colorScheme === 'light' ? Colors.light.background : Colors.dark.background }} contentContainerStyle={styles.container}>
                <Text style={[styles.title, { color: colorScheme === 'light' ? Colors.light.text : Colors.dark.text }]}>Соглашение об использовании персональных данных</Text>
                <Text style={[styles.text, { color: colorScheme === 'light' ? Colors.light.text : Colors.dark.text }]}>
                    Невка — некоммерческий продукт, созданный физическим лицом, с целью попрактиковаться в навыках PHP, MySQL и React Native.
                </Text>
                <Text style={[styles.text, { color: colorScheme === 'light' ? Colors.light.text : Colors.dark.text }]}>
                    Тем не менее, Невка может собирать персональные данные, такие, как:
                </Text>
                <Text style={[styles.text, { marginLeft: 40, color: colorScheme === 'light' ? Colors.light.text : Colors.dark.text }]}>
                    • Имя
                    {`\n`}• Фамилия
                    {`\n`}• Город
                    {`\n`}• Электронная почта
                </Text>
                <Text style={[styles.text, { color: colorScheme === 'light' ? Colors.light.text : Colors.dark.text }]}>
                    Указывать настоящие персональные данные можно, но не обязательно. По этим данным другие пользователи Невки смогут Вас найти или не найти. Поменять эти данные Вы можете в любой момент.
                </Text>
                <Text style={[styles.text, { color: colorScheme === 'light' ? Colors.light.text : Colors.dark.text }]}>
                    Имя, фамилия и город собираются с единственной целью: отображение в Вашем личном профиле. Электронная почта не отображается в профиле, а используется исключительно для авторизации. Пароли пользователей не хранятся и передаются в хэшированном виде по алгоритму SHA1. Все данные хранятся только на защищённом российском сервере и могут быть недоступны при использовании VPN. Никаким сторонним сервисам и компаниям, включая Яндекс Метрику и Google Аналитику, персональные данные не передаются.
                </Text>
                <Text style={[styles.text, { color: colorScheme === 'light' ? Colors.light.text : Colors.dark.text }]}>
                    Для регистрации и использования Невки, необходимо подтвердить, что любые персональные данные, которые Вы укажете в Вашем профиле, указаны добровольно.
                </Text>
                <View style={{ flexDirection: 'row', marginVertical: 20, width: '90%', justifyContent: 'space-between', marginBottom: 64 }}>
                    <Pressable
                        style={({ pressed }) => [buttonStyle, { backgroundColor: pressed ? '#660000' : '#990000' }]}
                        onPress={() => {
                            router.back();
                        }}>
                        <Text numberOfLines={1} style={{ fontSize: 20, color: colorScheme === 'light' ? Colors.light.text : Colors.dark.text }}>Не согласен</Text>
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [buttonStyle, { backgroundColor: pressed ? '#206040' : '#2d8659' }]}
                        onPress={() => {
                            router.back();
                            router.navigate('/signup');
                        }}>
                        <Text numberOfLines={1} style={{ fontSize: 20, color: colorScheme === 'light' ? Colors.light.text : Colors.dark.text }}>Согласен</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: '5%'
    },
    title: {
        fontSize: 32,
        marginVertical: '7%',
        marginHorizontal: '5%',
        textAlign: 'center'
    },
    text: {
        fontSize: 18,
        width: '90%',
        textAlign: 'left',
        marginVertical: 5
    },
    darkButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        width: '48%',
        borderRadius: 25,
        padding: '3%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.borders
    },
    lightButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        width: '48%',
        borderRadius: 25,
        padding: '3%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.light.borders
    }
});