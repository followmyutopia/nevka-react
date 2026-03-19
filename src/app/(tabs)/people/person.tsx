/**
 * Nevka Mobile v1.8
 * 2025-2026 Avicus Delacroix
 */

import {
  ActivityIndicator,
  StyleSheet,
  Image,
  useColorScheme,
  FlatList,
  Pressable,
} from "react-native";
import FullWidthImage from "react-native-fullwidth-image";
import { View, Text } from "@/src/components/Themed";
import { use, useEffect, useState } from "react";
import { useNevkaProvider } from "@/src/providers/nevkaProvider";
import { Redirect, router, Stack, useLocalSearchParams } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "@/src/constants/Colors";
import Dialog from "react-native-dialog";

type UserData = {
  id: string;
  firstname: string;
  lastname: string;
  status: string;
  city: string;
  bio: string;
  timestamp: number;
  avatar: string;
  online: string;
  push_token: string;
  vox_username: string;
};

type WallData = {
  id: string;
  text: string;
  image: string;
  timestamp: string;
  formattedTime: string;
  likes: string;
  author: string;
};

type UserInfoScreenProps = {
  user: UserData;
};

type WallPostProps = {
  item: WallData;
  user: UserData;
  likeHandler: (id: any) => void;
  me: string;
};

const UserInfoScreen = ({ user }: UserInfoScreenProps) => {
  const colorScheme = useColorScheme();
  const [callStarted, setCallStarted] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  return (
    <View style={{ width: "100%", padding: "3%" }}>
      <View style={{ flexDirection: "row", height: 150, paddingBottom: "4%" }}>
        <Image
          style={{
            height: "100%",
            aspectRatio: 1,
            borderRadius: 40,
            borderWidth: 1,
            borderColor:
              useColorScheme() === "light"
                ? Colors.light.borders
                : Colors.dark.borders,
          }}
          source={{ uri: user.avatar }}
        ></Image>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-around",
            height: "80%",
            paddingLeft: "4%",
          }}
        >
          <Text style={{ fontSize: 32 }}>{user.firstname}</Text>
          <Text style={{ fontSize: 32, paddingBottom: 10 }}>
            {user.lastname}
          </Text>
          {user.online === "online" && (
            <Text
              style={{
                fontSize: 18,
                color:
                  useColorScheme() === "light" ? "darkgreen" : "lightgreen",
              }}
            >
              {"\nОнлайн"}
            </Text>
          )}
          {user.online !== "online" && (
            <Text
              style={{
                fontSize: 18,
                color:
                  useColorScheme() === "light"
                    ? "darkslategray"
                    : "lightslategray",
              }}
            >
              {"Был(а) в сети:\n" + user.online}
            </Text>
          )}
        </View>
      </View>
      {user.status != "" ? (
        <Text
          style={{
            fontSize: 18,
            textAlign: "center",
            paddingBottom: "4%",
            paddingHorizontal: "4%",
          }}
        >
          {user.status}
        </Text>
      ) : null}
      {user.city != "" || user.bio != "" ? (
        <View
          style={{
            borderColor:
              useColorScheme() === "light"
                ? Colors.light.borders
                : Colors.dark.borders,
            borderRadius: 25,
            borderWidth: 1,
            padding: 15,
            marginBottom: "6%",
          }}
        >
          {user.city != "" ? (
            <Text style={{ fontSize: 18 }}>Город: {user.city}</Text>
          ) : null}
          {user.bio != "" ? (
            <Text style={{ fontSize: 18 }}>Информация: {user.bio}</Text>
          ) : null}
        </View>
      ) : null}
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <Pressable
          style={({ pressed }) => [
            useColorScheme() === "light"
              ? styles.lightRoundButton
              : styles.darkRoundButton,
            {
              backgroundColor: pressed
                ? useColorScheme() === "light"
                  ? "rgba(0, 0, 0, 0.11)"
                  : "rgba(255, 255, 255, 0.11)"
                : useColorScheme() === "light"
                  ? styles.lightButton.backgroundColor
                  : styles.darkButton.backgroundColor,
            },
          ]}
          onPress={() =>
            router.navigate(
              `/(tabs)/messages/chat?id=${user.id}&name=${user.firstname + " " + user.lastname}`,
              { withAnchor: true },
            )
          }
        >
          <FontAwesome
            name="envelope-o"
            size={25}
            color={Colors[colorScheme === "dark" ? "dark" : "light"].text}
            style={{ marginLeft: 0.5, marginBottom: 2 }}
          />
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            useColorScheme() === "light"
              ? styles.lightRoundButton
              : styles.darkRoundButton,
            {
              backgroundColor: pressed
                ? useColorScheme() === "light"
                  ? "rgba(0, 0, 0, 0.11)"
                  : "rgba(255, 255, 255, 0.11)"
                : useColorScheme() === "light"
                  ? styles.lightButton.backgroundColor
                  : styles.darkButton.backgroundColor,
            },
          ]}
          onPress={() => {
            if (!callStarted) {
              setCallStarted(true);
              router.navigate(`/call?id=${user.id}&direction=outgoing` as any);
              setTimeout(() => setCallStarted(false), 3000);
            }
          }}
        >
          <FontAwesome
            name="phone"
            size={25}
            color={Colors[colorScheme === "dark" ? "dark" : "light"].text}
            style={{ margin: 0 }}
          />
        </Pressable>
      </View>
    </View>
  );
};

const WallPost = ({ item, user, likeHandler, me }: WallPostProps) => {
  const likesArray = JSON.parse(item.likes);
  const colorScheme = useColorScheme();

  return (
    <View
      style={{
        width: "94%",
        margin: "3%",
        borderColor:
          useColorScheme() === "light"
            ? Colors.light.borders
            : Colors.dark.borders,
        borderRadius: 25,
        borderWidth: 1,
        padding: 15,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          height: 50,
          paddingBottom: "2%",
        }}
      >
        <Image
          style={{
            height: "100%",
            aspectRatio: 1,
            borderRadius: 10,
            borderWidth: 1,
            borderColor:
              useColorScheme() === "light"
                ? Colors.light.borders
                : Colors.dark.borders,
          }}
          source={{ uri: user.avatar }}
        ></Image>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-around",
            height: "100%",
            paddingLeft: "2%",
          }}
        >
          <Text style={{ fontSize: 18 }}>
            {user.firstname} {user.lastname}
          </Text>
          <Text
            style={{
              fontSize: 18,
              color:
                useColorScheme() === "light"
                  ? "darkslategray"
                  : "lightslategray",
            }}
          >
            {item.formattedTime}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "column" }}>
        {item.text != "" ? (
          <Text style={{ fontSize: 18 }}>{item.text}</Text>
        ) : null}
        {item.image != "" ? (
          <FullWidthImage
            style={{
              width: "100%",
              borderRadius: 10,
              marginTop: 10,
              borderWidth: 1,
              borderColor:
                useColorScheme() === "light"
                  ? Colors.light.borders
                  : Colors.dark.borders,
            }}
            source={{ uri: item.image }}
          ></FullWidthImage>
        ) : null}
        <View
          style={{
            flexDirection: "row",
            marginTop: "3%",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Pressable
            style={{
              flexDirection: "row",
              borderColor:
                useColorScheme() === "light"
                  ? Colors.light.borders
                  : Colors.dark.borders,
              borderRadius: 25,
              borderWidth: 1,
              padding: "3%",
            }}
            onPress={() => likeHandler(item.id)}
          >
            {({ pressed }) => (
              <>
                <FontAwesome
                  name="heart"
                  size={18}
                  color={
                    likesArray.includes(parseInt(me))
                      ? "crimson"
                      : Colors[colorScheme === "dark" ? "dark" : "light"].text
                  }
                  style={{ opacity: pressed ? 0.5 : 1 }}
                />
                {likesArray.length != 0 ? (
                  <Text
                    style={{
                      fontSize: 15,
                      marginLeft: 10,
                    }}
                  >
                    {likesArray.length}
                  </Text>
                ) : null}
              </>
            )}
          </Pressable>
          <View style={{ flex: 1 }}></View>
        </View>
      </View>
    </View>
  );
};

export default function person() {
  const { domain, token, setToken, loggedUser }: any = useNevkaProvider();
  if (token == "") {
    return <Redirect href={"/"} />;
  }
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();

  const isFocused = useIsFocused();
  const [update, setUpdate] = useState(0);
  const [userData, setUserData] = useState<UserData>();
  const [wallData, setWallData] = useState<WallData[]>([]);
  const [loading, setLoading] = useState(true);
  const [wallLoading, setWallLoading] = useState(true);

  const colorScheme = useColorScheme();

  const getUserData = async (id: string) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("token", token);
    formData.append("api-key", "qonxod-Kicmad-4puvhy");

    try {
      const response = await fetch(domain + "/api/getUserData.php", {
        method: "POST",
        body: formData,
      });
      const json = await response.json();
      if (json.result == "failure") {
        if (json.error == "wrong_token") {
          setToken("");
        }
        console.log("getUserData error: " + json.error);
      } else if (json.result == "success") {
        setUserData(json);
        setLoading(false);
      }
    } catch (error) {
      console.log(
        "Ошибка запроса данных пользователя, проблемы с соединением?\n" + error,
      );
    }
  };

  const getWall = async (id: string) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("api-key", "qonxod-Kicmad-4puvhy");

    try {
      const response = await fetch(domain + "/api/getWall.php", {
        method: "POST",
        body: formData,
      });
      const json = await response.json();
      if (json.result == "failure") {
        console.log("getUserData error: " + json.error);
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
  };

  const likePost = async (postId: string) => {
    const formData = new FormData();
    formData.append("token", token);
    formData.append("postId", postId);
    formData.append("api-key", "qonxod-Kicmad-4puvhy");

    try {
      const response = await fetch(domain + "/api/likePost.php", {
        method: "POST",
        body: formData,
      });
      const json = await response.json();
      if (json.result == "failure") {
        if (json.error == "wrong_token") {
          setToken("");
        }
        console.log("likePost error: " + json.error);
      } else if (json.result == "success") {
        getWall(id);
      }
    } catch (error) {
      console.log("Ошибка лайка записи, проблемы с соединением?\n" + error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => setUpdate(update + 1), 5000);
      getUserData(id);
      console.log("Updated: UserData for: " + id);
      getWall(id);
      console.log("Updated: Wall for: " + id);
    }
  }, [update, isFocused]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: name }} />
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} />
      ) : (
        <FlatList
          ListHeaderComponent={<UserInfoScreen user={userData!} />}
          ListFooterComponent={<View style={{ height: 80 }}></View>}
          style={{ flex: 1, width: "100%" }}
          data={wallData || <ActivityIndicator />}
          renderItem={({ item }) => (
            <WallPost
              item={item}
              user={userData!}
              likeHandler={likePost}
              me={loggedUser}
            />
          )}
          ListEmptyComponent={
            <Text
              style={{
                fontSize: 18,
                textAlign: "center",
                margin: 15,
                color:
                  colorScheme === "light" ? "darkslategray" : "lightslategray",
              }}
            >
              Записей на стене нет
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkButton: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 25,
    padding: "3%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.dark.borders,
  },
  lightButton: {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    borderRadius: 25,
    padding: "3%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.borders,
  },
  darkRoundButton: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.dark.borders,
  },
  lightRoundButton: {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.light.borders,
  },
  buttonText: {
    fontSize: 20,
  },
});
