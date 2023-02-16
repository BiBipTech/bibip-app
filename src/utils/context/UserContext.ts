import { CognitoUser } from "amazon-cognito-identity-js";
import { createContext } from "react";

export type UserContextType = {
  user: CognitoUser | undefined;
  setUser: (user: CognitoUser | undefined) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  token: string | undefined;
  isInTrip: boolean | undefined;
  setIsInTrip: (isInTrip: boolean) => void;
  updateToken: () => void;
};

const UserContext = createContext<UserContextType>({
  user: undefined,
  setUser: (user) => {},
  isLoading: false,
  setIsLoading: (isLoading: boolean) => {},
  token: undefined,
  isInTrip: false,
  setIsInTrip: (isInTrip: boolean) => {},
  updateToken: () => {},
});

export default UserContext;
