import { createContext } from "react";

export const UserProfile = {
  name: "Pedro",
  surname: "López",
  tag: "mobile",
  isConnected: true,
  isPermanent: true,
}

export const UserContext = createContext();
export const UserProvider = UserContext.Provider;

