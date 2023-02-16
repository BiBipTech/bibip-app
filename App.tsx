import React, { useEffect } from "react";
import Router from "./Router";
import { Amplify, API, Auth } from "aws-amplify";
import awsconfig from "./src/aws-exports";
import useUser from "./src/utils/hooks/useUser";
import UserContext from "./src/utils/context/UserContext";
import { QueryClientProvider, QueryClient } from "react-query";
import FlashMessage from "react-native-flash-message";
import { StatusBar } from "expo-status-bar";

Amplify.configure(awsconfig);

export default function App() {
  const user = useUser();

  useEffect(() => {
    user.setIsLoading(true);
  }, []);

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider
        value={{
          user: user.user,
          setUser: user.setUser,
          isLoading: user.isLoading,
          setIsLoading: user.setIsLoading,
          token: user.token,
          isInTrip: user.isInTrip,
          setIsInTrip: user.setIsInTrip,
          updateToken: user.updateToken,
        }}
      >
        <Router />
      </UserContext.Provider>
      <FlashMessage position="top" />
      <StatusBar style="dark" />
    </QueryClientProvider>
  );
}
