import * as queries from "../../../graphql/queries";
import * as mutations from "../../../graphql/mutations";
import gql from "../../../utils/gql/gql";
import { GetTripResult, UpdateTripResult } from "./TripSummary.type";
import { getTripStatus, promiseWithLoader } from "../../../utils/aws/api";
import { Dispatch, SetStateAction } from "react";
import { UserContextType } from "../../../utils/context/UserContext";

export const getTrip = async (tripId: string) => {
  const trip = await gql<GetTripResult>({
    query: queries.getTrip,
    variables: {
      id: tripId,
    },
  });

  return trip;
};

export const updateRating = async (
  tripId: string,
  rating: number,
  version: number
) => {
  const updatedTrip = await gql<UpdateTripResult>({
    query: mutations.updateTrip,
    variables: {
      input: {
        id: tripId,
        rating: rating,
        _version: version,
      },
    },
  }).catch((err) => {
    return;
  });

  return updatedTrip;
};

export const exitTripStack = async (
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  userContext: UserContextType
) => {
  await promiseWithLoader(
    setIsLoading,
    getTripStatus(userContext.user!, userContext.token!).then((val) => {
      userContext.setIsInTrip(val.inTrip);
    })
  );
};
