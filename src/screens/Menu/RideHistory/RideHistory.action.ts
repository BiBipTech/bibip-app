import { timeUntilStale } from "react-query/types/core/utils";
import * as queries from "../../../graphql/queries";
import gql from "../../../utils/gql/gql";
import { GetTripsOfUserResult } from "./RideHistory.type";

export const getTripsOfUser = async (username: string) => {
  const trips = (
    await gql<GetTripsOfUserResult>({
      query: queries.listTrips,
      variables: {
        user: username,
      },
    })
  ).data?.listTrips.items;

  return trips?.sort((a, b) => b.time?.end! - a.time?.end!);
};
