import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

const NevkaContext = createContext({});

export default function NevkaProvider({children}: PropsWithChildren) {
    const [token, setToken] = useState<string>("");
    const [loggedUser, setLoggedUser] = useState<string>("");

    return(
        <NevkaContext.Provider value={{ token, setToken, loggedUser, setLoggedUser }}>
            {children}
        </NevkaContext.Provider>
    );
};

export const useNevkaProvider = () => useContext(NevkaContext);