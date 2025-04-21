import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

const NevkaContext = createContext({});

export default function NevkaProvider({children}: PropsWithChildren) {
    const [token, setToken] = useState<string>("");
    const [loggedUser, setLoggedUser] = useState<string>("");

    // const checkToken = async (uncheckedToken: string) => {
    //     const formData = new FormData();
    //     formData.append("token", uncheckedToken);

    //     try {
    //         const response = await fetch('https://nevka.site/api/checkToken.php', {
    //             method: 'POST',
    //             body: formData
    //         });
    //         const json = await response.json();
    //         if (json.result == 0) {
    //             setToken("");
    //         } else {
    //             return json.result;
    //         }
    //     } catch (error) {
    //         setToken("");
    //     }
    // };

    // const loggedUser = checkToken(token);

    return(
        <NevkaContext.Provider value={{ token, setToken, loggedUser, setLoggedUser }}>
            {children}
        </NevkaContext.Provider>
    );
};

export const useNevkaProvider = () => useContext(NevkaContext);