import { createContext, PropsWithChildren, useContext } from "react";

const NevkaContext = createContext({});

const NevkaProvider = ({children}: PropsWithChildren) => {
    return(
        <NevkaContext.Provider value={{items: [], onAddItem: () => {}}}>
            {children}
        </NevkaContext.Provider>
    );
};

export default NevkaProvider;

export const useNevkaProvider = () => useContext(NevkaContext);