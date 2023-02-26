import { TRIP_API } from "@env";
import { CognitoUser } from "amazon-cognito-identity-js";
import { Auth, Hub, PubSub } from "aws-amplify";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { awsGet } from "../aws/api";

const useUser = () => {
  const [user, setUser] = useState<CognitoUser | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState("");
  const [isInTrip, setIsInTrip] = useState(false);
  const [isInTripLoading, setIsInTripLoading] = useState(true);

  const signOut = async () => {
    if (user) {
      await Auth.signOut({
        global: true,
      });
      setUser(undefined);
    }
  };

  const signIn = async (username: string) => {
    return await Auth.signIn({
      username: username,
      password: username,
    });
  };

  const confirmSignIn = async (
    otp: string,
    user: unknown
  ): Promise<CognitoUser> => {
    const res = await Auth.confirmSignIn(user, otp, "SMS_MFA");
    setUser(res);
    return res;
  };

  const updateToken = () => {
    Auth.currentSession().then((val) => {
      setToken(val.getIdToken().getJwtToken());
    });
  };

  useEffect(() => {
    try {
      Auth.currentUserPoolUser()
        .then((val: CognitoUser) => {
          setUser(val);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    if (user) {
      updateToken();
    }
  }, [user]);

  useEffect(() => {
    if (token)
      awsGet(
        `${TRIP_API}/fetch-trip-status/${user?.getUsername()!}`,
        token!
      ).then((val) => {
        setIsInTrip(val.data.inTrip);
        setIsInTripLoading(false);
      });
  }, [token]);

  return {
    user,
    confirmSignIn,
    signIn,
    signOut,
    setUser,
    isLoading,
    setIsLoading,
    token,
    isInTrip,
    setIsInTrip,
    updateToken,
    isInTripLoading,
  };
};

export default useUser;
