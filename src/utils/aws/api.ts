import { TRIP_API } from "@env";
import { CognitoUser } from "amazon-cognito-identity-js";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";

export const awsPost = (
  url: string,
  data: { [key: string]: string | number | boolean | object },
  token: string
) => {
  return axios({
    method: "POST",
    data: data,
    url: url,
    headers: {
      "x-aws-cognito-token": token,
    },
  });
};

export const awsGet = (url: string, token: string) => {
  return axios({
    method: "GET",
    url: url,
    headers: {
      "x-aws-cognito-token": token,
    },
  });
};

export const promiseWithLoader = async <T>(
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  promise: Promise<T>
) => {
  setIsLoading(true);
  const response = await promise.catch((err) => {
    setIsLoading(false);
    return undefined as T;
  });
  setIsLoading(false);

  return response;
};

export const getTripStatus = async (user: CognitoUser, token: string) => {
  const tripStatus = await awsGet(
    `${TRIP_API}/fetch-trip-status/${user?.getUsername()!}`,
    token!
  );
  return tripStatus.data;
};
