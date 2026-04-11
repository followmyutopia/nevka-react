/**
 * Nevka Mobile v1.8
 * 2025-2026 Avicus Delacroix
 */

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
  useRef,
  use,
} from "react";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance, StyleSheet, View } from "react-native";
import { RelativePathString, router } from "expo-router";
// import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import { WebView } from "react-native-webview";
import Dialog from "react-native-dialog";
// import { get } from "react-native/Libraries/NativeComponent/NativeComponentRegistry";
const voxKey = process.env.EXPO_PUBLIC_VOX_PASS;

const NevkaContext = createContext({});

type PushDataObject = {
  url?: RelativePathString;
};

export default function NevkaProvider({ children }: PropsWithChildren) {
  const [token, setTokenLocal] = useState<string>("");
  const [loggedUser, setLoggedUserLocal] = useState<string>("");
  const [theme, setThemeLocal] = useState<string>("");
  const [messageCounter, setMessageCounterLocal] = useState<number>(0);
  const [isNameSet, setIsNameSet] = useState<boolean>(true);
  const [pushToken, setPushTokenLocal] = useState<string>();
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const [encryptionType, setEncryptionTypeLocal] = useState<string>("");
  const [notificationStatus, setNotificationStatusLocal] = useState<string>("");
  const [domain, setDomainLocal] = useState<string>("");
  const [notice, setNoticeLocal] = useState<string>("");
  const [newNotice, setNewNotice] = useState<string>("");
  const [callErrorMessage, setCallErrorMessage] = useState<string>("");
  const [callActive, setCallActive] = useState<boolean>(false);
  const [voxUsername, setVoxUsername] = useState("");
  const [voxLogged, setVoxLogged] = useState(false);
  const [latestVersion, setLatestVersion] = useState("");
  const webviewRef = useRef<WebView>(null);
  const [noticeVisible, setNoticeVisible] = useState(false);

  const setMessageCounter = async (value: number) => {
    setMessageCounterLocal(value);
    Notifications.setBadgeCountAsync(value);
  };

  const setPushToken = async (value: string) => {
    setPushTokenLocal(value);
    try {
      await AsyncStorage.setItem("push_token", value);
    } catch (e) {
      console.log("AsyncStorage error: " + e);
    }
  };

  const setToken = async (value: string) => {
    setTokenLocal(value);
    try {
      await AsyncStorage.setItem("token", value);
    } catch (e) {
      console.log("AsyncStorage error: " + e);
    }
  };

  const setLoggedUser = async (value: string) => {
    setLoggedUserLocal(value);
    try {
      await AsyncStorage.setItem("loggedUser", value);
    } catch (e) {
      console.log("AsyncStorage error: " + e);
    }
  };

  const setTheme = async (value: string) => {
    setThemeLocal(value);
    if (value == "light") Appearance.setColorScheme("light");
    if (value == "dark") Appearance.setColorScheme("dark");
    try {
      await AsyncStorage.setItem("theme", value);
    } catch (e) {
      console.log("AsyncStorage error: " + e);
    }
  };

  const setEncryptionType = async (value: string) => {
    setEncryptionTypeLocal(value);
    try {
      await AsyncStorage.setItem("encryption", value);
    } catch (e) {
      console.log("AsyncStorage error: " + e);
    }
  };

  const setNotificationStatus = async (value: string) => {
    setNotificationStatusLocal(value);
    try {
      await AsyncStorage.setItem("notificationStatus", value);
    } catch (e) {
      console.log("AsyncStorage error: " + e);
    }
  };

  const setDomain = async (value: string) => {
    setDomainLocal(value);
    try {
      await AsyncStorage.setItem("domain", value);
    } catch (e) {
      console.log("AsyncStorage error: " + e);
    }
  };

  const setNotice = async (value: string) => {
    setNoticeLocal(value);
    try {
      await AsyncStorage.setItem("notice", value);
    } catch (e) {
      console.log("AsyncStorage error: " + e);
    }
  };

  const getNotice = async () => {
    try {
      const value = await AsyncStorage.getItem("notice");
      if (value !== null) {
        setNoticeLocal(value);
      }
    } catch (e) {
      console.log("AsyncStorage error: " + e);
    }
  };

  const getDomain = async () => {
    try {
      const value = await AsyncStorage.getItem("domain");
      if (value !== null) {
        setDomainLocal(value);
      }
    } catch (e) {
      console.log("AsyncStorage error: " + e);
    }
  };

  const getNotificationStatus = async () => {
    try {
      const value = await AsyncStorage.getItem("notificationStatus");
      if (value !== null) {
        setNotificationStatusLocal(value);
      }
    } catch (e) {
      console.log("AsyncStorage error: " + e);
    }
  };

  const getEncryptionType = async () => {
    try {
      const value = await AsyncStorage.getItem("encryption");
      if (value !== null) {
        setEncryptionTypeLocal(value);
      }
    } catch (e) {
      console.log("AsyncStorage error: " + e);
    }
  };

  const getPushToken = async () => {
    try {
      const value = await AsyncStorage.getItem("push_token");
      if (value !== null) {
        setPushTokenLocal(value);
      }
    } catch (e) {
      console.log("AsyncStorage error: " + e);
    }
  };

  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      if (value !== null) {
        setTokenLocal(value);
      }
    } catch (e) {
      console.log("AsyncStorage error: " + e);
    }
  };

  const getLoggedUser = async () => {
    try {
      const value = await AsyncStorage.getItem("loggedUser");
      if (value !== null) {
        setLoggedUserLocal(value);
      }
    } catch (e) {
      console.log("AsyncStorage error: " + e);
    }
  };

  const getTheme = async () => {
    try {
      const value = await AsyncStorage.getItem("theme");
      if (value !== null) {
        setThemeLocal(value);
        if (value == "light") Appearance.setColorScheme("light");
        if (value == "dark") Appearance.setColorScheme("dark");
      }
    } catch (e) {
      console.log("AsyncStorage error: " + e);
    }
  };

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  const locales = new I18n({
    en: {
      profile: "Profile",
      people: "People",
      messages: "Messages",
      discussions: "Discussions",
      settings: "Settings",
      personal: "Personal info",
      firstname: "First name (required)",
      lastname: "Last name (required)",
      city: "City",
      bio: "Bio",
      setinfo: "Set info",
      setting: "Setting...",
      avatar: "Avatar",
      now: "Now",
      willbe: "To be set",
      choosefile: "Choose file",
      setavatar: "Set avatar",
      notselected: "No file selected",
    },
    ru: {
      profile: "Профиль",
      people: "Люди",
      messages: "Сообщения",
      discussions: "Обсуждения",
      settings: "Настройки",
      personal: "Личная информация",
      firstname: "Имя (обязательно)",
      lastname: "Фамилия (обязательно)",
      city: "Город",
      bio: "Информация",
      setinfo: "Установить информацию",
      setting: "Установка...",
      avatar: "Аватар",
      now: "Сейчас",
      willbe: "Будет",
      choosefile: "Выбрать файл",
      setavatar: "Установить аватар",
      notselected: "Не выбрано",
    },
    sv: {
      profile: "Profil",
      people: "Personer",
      messages: "Meddelanden",
      discussions: "Diskussioner",
    },
  });

  // Set the locale once at the beginning of your app.
  // locales.locale = getLocales()[0].languageCode ?? 'ru';
  locales.locale = "ru";

  const _V_SEG = [
    [0x20, 0xd7ff],
    [0xe000, 0x10ffff],
  ];
  const _V_LEN = 0x10f7e0;

  const _f_ptr = (cp: number): number => {
    const _b0 = _V_SEG[0];
    if (cp >= _b0[0] && cp <= _b0[1]) return cp - _b0[0];
    if (cp >= _V_SEG[1][0] && cp <= _V_SEG[1][1])
      return _b0[1] - _b0[0] + 1 + (cp - 0xe000);
    return _f_ptr(0xfffd);
  };

  const _f_raw = (idx: number): number => {
    const _limit = _V_SEG[0][1] - _V_SEG[0][0];
    return idx <= _limit ? 0x20 + idx : 0xe000 + (idx - (_limit + 1));
  };

  function transformPointer(k: string): number {
    return Array.from(k).reduce(
      (h, c) => (Math.imul(h, 0x1f) + c.charCodeAt(0)) >>> 0,
      0,
    );
  }

  function encode(text: string, key: string): string {
    const _sig = transformPointer(key);
    return Array.from(text)
      .map((_t, _i) => {
        const _offs = (_f_ptr(_t.codePointAt(0)!) + _sig + _i * 0x25) % _V_LEN;
        return String.fromCodePoint(_f_raw(_offs));
      })
      .join("");
  }

  function decode(encoded: string, key: string): string {
    const _sig = transformPointer(key);
    const _buf = Array.from(encoded).map((c) => c.codePointAt(0)!);
    return _buf
      .map((_cp, _i) => {
        const _idx = _f_ptr(_cp);
        const _delta = (_idx - (_sig + _i * 0x25)) % _V_LEN;
        return String.fromCodePoint(
          _f_raw(((_delta % _V_LEN) + _V_LEN) % _V_LEN),
        );
      })
      .join("");
  }

  const voxLogin = (username: string) => {
    console.log("Voximplant: logging in as " + username);
    webviewRef.current?.injectJavaScript(`
            window.login('${username}'+'@nevka.avicus.n4.voximplant.com', ${voxKey});
            true;
        `);
  };

  const checkVoxUsername = async (username: string) => {
    const formData = new FormData();
    formData.append("vox_username", username);
    formData.append("api-key", "qonxod-Kicmad-4puvhy");

    try {
      const response = await fetch(domain + "/api/checkVoxUsername.php", {
        method: "POST",
        body: formData,
      });
      const json = await response.json();
      if (json.result == "failure") {
        console.log("checkVoxUsername error: " + json.error);
      } else if (json.result == "success") {
        return json.id;
      }
    } catch (error) {
      console.log(
        "Ошибка проверки пользователя Voximplant, проблемы с соединением?\n" +
          error,
      );
    }
  };

  const initCheck = async () => {
    try {
      const response = await fetch(
        "https://followmyutopia.github.io/nevka-settings.json",
        {
          method: "GET",
        },
      );
      const json = await response.json();
      setDomain(json.domain);
      setNewNotice(json.message);
      console.log("Current domain: " + json.domain);
    } catch (e) {
      console.log(e);
      setDomain("https://nevka.online");
    }
  };

  useEffect(() => {
    getNotice();
    getDomain();
    initCheck();
    getToken();
    getLoggedUser();
    getTheme();
    getPushToken();
    getEncryptionType();
    getNotificationStatus();

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notif) => {
        setNotification(notif);
      },
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const raw = response.notification.request.content.data;
        if (raw && typeof raw === "object" && "url" in raw) {
          const data = raw as PushDataObject;
          if (data.url) {
            router.navigate(data.url, { withAnchor: true });
          }
        }
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  useEffect(() => {
    if (newNotice !== notice) {
      setNotice(newNotice);
      setNoticeVisible(true);
    }
  }, [newNotice]);

  return (
    <NevkaContext.Provider
      value={{
        locales,
        webviewRef,
        callActive,
        voxLogin,
        domain,
        voxUsername,
        setVoxUsername,
        voxLogged,
        setVoxLogged,
        callErrorMessage,
        setCallErrorMessage,
        token,
        setToken,
        loggedUser,
        setLoggedUser,
        messageCounter,
        setMessageCounter,
        isNameSet,
        setIsNameSet,
        pushToken,
        setPushToken,
        theme,
        setTheme,
        encryptionType,
        setEncryptionType,
        encode,
        decode,
        notificationStatus,
        setNotificationStatus,
        latestVersion,
        setLatestVersion,
      }}
    >
      {children}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      >
        <Dialog.Container visible={noticeVisible}>
          <Dialog.Title>Важные новости</Dialog.Title>
          <Dialog.Description>{notice}</Dialog.Description>
          <Dialog.Button
            label="Понятно"
            onPress={() => {
              setNoticeVisible(false);
            }}
          />
        </Dialog.Container>
        <WebView
          ref={webviewRef}
          source={{ uri: "https://nevka.online/api/vox.html" }}
          style={{
            flex: 1,
            backgroundColor: "transparent",
          }}
          javaScriptEnabled
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === "console") {
                console.log(...data.log);
              } else if (data.type === "warn") {
                console.warn(...data.log);
              } else if (data.type === "error") {
                console.error(...data.log);
              } else if (data.type === "incomingCall") {
                checkVoxUsername(data.username).then((id) => {
                  router.navigate(`/call?id=${id}&direction=incoming` as any);
                });
              } else if (data.type === "CallConnected") {
                setCallActive(true);
              } else if (data.type === "CallError") {
                setCallActive(false);
                setCallErrorMessage(data.message);
              } else if (
                data.type === "SdkDisconnected" ||
                data.type === "ConnectionError"
              ) {
                console.log("Voximplant: SDK disconnected");
                setCallErrorMessage("Ошибка соединения");
                setVoxLogged(false);
              } else if (
                data.type === "CallFailed" ||
                data.type === "CallDisconnected"
              ) {
                setCallActive(false);
                if (router.canGoBack()) router.back();
              } else {
                console.log("Voximplant: ", data);
              }
            } catch (e) {
              console.log(event.nativeEvent.data);
            }
          }}
        />
      </View>
    </NevkaContext.Provider>
  );
}

export const useNevkaProvider = () => useContext(NevkaContext);
