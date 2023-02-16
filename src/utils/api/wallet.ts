import { awsGet, awsPost } from "../aws/api";
import { WALLET_API } from "@env";

export const getFunds = async (username: string, token: string) => {
  return await awsGet(`${WALLET_API}/wallets/${username}`, token);
};

export const addFunds = async (
  username: string,
  token: string,
  amount: number
) => {
  return await awsPost(
    `${WALLET_API}/wallets/${username}/add`,
    {
      amount: amount,
    },
    token
  );
};

export const withdrawFunds = async (
  username: string,
  token: string,
  amount: number
) => {
  return await awsPost(
    `${WALLET_API}/wallets/${username}/withdraw`,
    {
      amount: amount,
    },
    token
  );
};
