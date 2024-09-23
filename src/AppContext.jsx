/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const AppContext = createContext({ ethersData: null })
export default function AppContextProvider({ children }) {
  const [ethersData, setEthersData] = useState({
    provider: null,
    signer: null
  })
  const [address, setAddress] = useState(false)

  return <AppContext.Provider value={{ ethersData, setEthersData, address, setAddress }}>
    {children}
  </AppContext.Provider>
}