import { PBM_API, TRIP_API } from "@env";
import { awsGet, awsPost } from "../aws/api";

export const listCards = (username: string) => {
  return awsPost(
    `${PBM_API}/list-cards`,
    {
      account: username,
    },
    ""
  );
};

export const encryptCard = async (
  cardNo: string,
  month: string,
  year: string,
  cvv: string
) => {
  return await awsPost(
    `${PBM_API}/encrypt-card`,
    {
      cardNumber: cardNo,
      expMonth: month,
      expYear: year,
      cvv: cvv,
    },
    ""
  );
};

export const saveCard = async (
  username: string,
  encryptedCard: string,
  cardOwner: string,
  redirect: string
) => {
  return await awsPost(
    `${PBM_API}/save-card`,
    {
      account: username,
      encrypted: encryptedCard,
      cardOwner: cardOwner,
      redirect: redirect,
    },
    ""
  );
};

export const saveCardToDb = async (
  username: string,
  cardGuid: string,
  cardOwner: string
) => {
  return await awsPost(
    `${PBM_API}/save-card-db`,
    {
      account: username,
      cardGuid: cardGuid,
      cardOwner: cardOwner,
    },
    ""
  );
};

export const getDefaultCard = async (username: string) => {
  return await awsGet(`${TRIP_API}/default-card/${username}`, "");
};
