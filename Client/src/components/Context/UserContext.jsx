import { createContext } from "react";

export const UserProfile = {
  name: "",
  surname: "",
  tag: "",
  isConnected: false,
  isPermanent: false
};

export const UserContext = createContext();
export const UserProvider = UserContext.Provider;
