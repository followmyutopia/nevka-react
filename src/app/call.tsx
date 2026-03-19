/**
 * Nevka Mobile v1.8
 * 2025-2026 Avicus Delacroix
 */

import {
  View,
  StyleSheet,
  Text,
  useColorScheme,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Colors from "../constants/Colors";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { use, useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNevkaProvider } from "../providers/nevkaProvider";

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

export default function Call() {
  const {
    domain,
    token,
    setToken,
    loggedUser,
    webviewRef,
    callActive,
    callErrorMessage,
    setCallErrorMessage,
  }: any = useNevkaProvider();
  if (token == "") {
    return <Redirect href={"/"} />;
  }

  const { id, direction } = useLocalSearchParams<{
    id: string;
    direction: string;
  }>();
  const [loading, setLoading] = useState(true);
  const [statusString, setStatusString] = useState("");
  const [userData, setUserData] = useState<UserData>();
  const [showIncomingCallButtons, setShowIncomingCallButtons] = useState(false);
  const [showCallButtons, setShowCallButtons] = useState(false);
  const [showErrorButtons, setShowErrorButtons] = useState(false);
  const colorScheme = useColorScheme();
  const isFocused = useIsFocused();

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
        if (direction === "outgoing") {
          makeCall(json.vox_username);
        }
      }
    } catch (error) {
      console.log(
        "Ошибка запроса данных пользователя, проблемы с соединением?\n" + error,
      );
    }
  };

  const answerCall = () => {
    webviewRef.current?.injectJavaScript(`
            window.answerCall();
            true;
        `);
  };

  const declineCall = () => {
    webviewRef.current?.injectJavaScript(`
            window.declineCall();
            true;
        `);
  };

  const hangupCall = () => {
    webviewRef.current?.injectJavaScript(`
            window.hangupCall();
            true;
        `);
  };

  const makeCall = (username: string) => {
    setCallErrorMessage("");
    webviewRef.current?.injectJavaScript(`
            window.startCall('${username}'+'@nevka.avicus.n4.voximplant.com');
            true;
        `);
  };

  useEffect(() => {
    if (isFocused) {
      getUserData(id).then(() => {
        if (direction === "outgoing") {
          setStatusString("Выполняется вызов...");
          setShowCallButtons(true);
          setShowErrorButtons(false);
          setShowIncomingCallButtons(false);
        } else {
          setStatusString("Входящий вызов...");
          setShowIncomingCallButtons(true);
          setShowErrorButtons(false);
          setShowCallButtons(false);
        }
      });
    }

    return () => {
      declineCall();
      hangupCall();
    };
  }, []);

  useEffect(() => {
    if (callActive) {
      let callTime = 0;
      setInterval(() => {
        callTime++;
        const minutes = Math.floor(callTime / 60);
        const seconds = callTime % 60;
        const displaySeconds = seconds.toString().padStart(2, "0");
        setStatusString(`${minutes}:${displaySeconds}`);
      }, 1000);
    }
  }, [callActive]);

  useEffect(() => {
    if (callErrorMessage !== "") {
      setStatusString(callErrorMessage);
      setShowCallButtons(false);
      setShowErrorButtons(true);
    }
  }, [callErrorMessage]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colorScheme === "light"
              ? Colors.light.background
              : Colors.dark.background,
          width: "100%",
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} />
      ) : (
        <>
          <Text
            style={{
              fontSize: 34,
              color:
                colorScheme === "light" ? Colors.light.text : Colors.dark.text,
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            {userData!.firstname + " " + userData!.lastname}
          </Text>
          <Text
            style={{
              fontSize: 20,
              color:
                colorScheme === "light" ? Colors.light.text : Colors.dark.text,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            {statusString}
          </Text>
          <Image
            style={{
              width: "90%",
              aspectRatio: 1,
              borderRadius: 50,
              borderWidth: 1,
              marginBottom: 20,
              borderColor:
                colorScheme === "light"
                  ? Colors.light.borders
                  : Colors.dark.borders,
            }}
            source={{ uri: userData!.avatar }}
          ></Image>

          {showIncomingCallButtons ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "90%",
                padding: 20,
              }}
            >
              <Pressable
                style={({ pressed }) => [
                  colorScheme === "light"
                    ? styles.lightRoundButton
                    : styles.darkRoundButton,
                  {
                    backgroundColor: pressed
                      ? "rgba(0, 128, 0, 1)"
                      : "rgba(0, 192, 0, 1)",
                  },
                ]}
                onPress={() => {
                  answerCall();
                  setShowIncomingCallButtons(false);
                  setShowCallButtons(true);
                }}
              >
                <FontAwesome
                  name="phone"
                  size={25}
                  color={Colors[colorScheme === "dark" ? "dark" : "light"].text}
                  style={{}}
                />
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  colorScheme === "light"
                    ? styles.lightRoundButton
                    : styles.darkRoundButton,
                  {
                    backgroundColor: pressed
                      ? "rgba(128, 0, 0, 1)"
                      : "rgba(192, 0, 0, 1)",
                  },
                ]}
                onPress={() => {
                  declineCall();
                }}
              >
                <FontAwesome
                  name="phone"
                  size={25}
                  color={Colors[colorScheme === "dark" ? "dark" : "light"].text}
                  style={{ transform: [{ rotate: "135deg" }] }}
                />
              </Pressable>
            </View>
          ) : null}

          {showCallButtons ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "90%",
                padding: 20,
              }}
            >
              {/* <Pressable
                        style={({ pressed }) => [colorScheme === 'light' ? styles.lightRoundButton : styles.darkRoundButton, { backgroundColor: pressed ? "rgba(0, 128, 0, 1)" : "rgba(0, 192, 0, 1)" }]}
                        onPress={() => {
                            answerCall();
                            setShowIncomingCallButtons(false);
                            setShowCallButtons(true);
                        }}>
                        <FontAwesome
                            name="phone"
                            size={25}
                            color={Colors[(colorScheme === 'dark' ? 'dark' : 'light')].text}
                            style={{}}
                        />
                    </Pressable> */}

              <Pressable
                style={({ pressed }) => [
                  colorScheme === "light"
                    ? styles.lightRoundButton
                    : styles.darkRoundButton,
                  {
                    backgroundColor: pressed
                      ? "rgba(128, 0, 0, 1)"
                      : "rgba(192, 0, 0, 1)",
                  },
                ]}
                onPress={() => {
                  hangupCall();
                }}
              >
                <FontAwesome
                  name="phone"
                  size={25}
                  color={Colors[colorScheme === "dark" ? "dark" : "light"].text}
                  style={{ transform: [{ rotate: "135deg" }] }}
                />
              </Pressable>
            </View>
          ) : null}

          {showErrorButtons ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "90%",
                padding: 20,
              }}
            >
              <Pressable
                style={({ pressed }) => [
                  colorScheme === "light"
                    ? styles.lightRoundButton
                    : styles.darkRoundButton,
                  {
                    backgroundColor: pressed
                      ? colorScheme === "light"
                        ? "rgba(0, 0, 0, 0.11)"
                        : "rgba(255, 255, 255, 0.11)"
                      : colorScheme === "light"
                        ? styles.lightButton.backgroundColor
                        : styles.darkButton.backgroundColor,
                  },
                ]}
                onPress={() => {
                  hangupCall();
                  router.back();
                }}
              >
                <FontAwesome
                  name="times"
                  size={25}
                  color={Colors[colorScheme === "dark" ? "dark" : "light"].text}
                />
              </Pressable>
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "3%",
  },
  darkRoundButton: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    width: 75,
    height: 75,
    borderRadius: 37,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.dark.borders,
  },
  lightRoundButton: {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    width: 75,
    height: 75,
    borderRadius: 37,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.light.borders,
  },

  console: {
    fontSize: 20,
    color: "orange",
    textAlign: "center",
  },
  label: {
    fontSize: 20,
    textAlign: "left",
    marginVertical: 8,
  },
  text: {
    fontSize: 20,
    marginHorizontal: 15,
    textAlign: "center",
    marginVertical: 8,
  },
  darkInput: {
    width: "100%",
    color: Colors.dark.text,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    padding: "3%",
    borderRadius: 25,
    fontSize: 20,
    borderWidth: 1,
    borderColor: Colors.dark.borders,
  },
  lightInput: {
    width: "100%",
    color: Colors.light.text,
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    padding: "3%",
    borderRadius: 25,
    fontSize: 20,
    borderWidth: 1,
    borderColor: Colors.light.borders,
  },
  darkButton: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    width: "100%",
    marginVertical: "4%",
    borderRadius: 25,
    padding: "3%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.dark.borders,
  },
  lightButton: {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    width: "100%",
    marginVertical: "4%",
    borderRadius: 25,
    padding: "3%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.borders,
  },
  buttonText: {
    fontSize: 20,
  },
});
