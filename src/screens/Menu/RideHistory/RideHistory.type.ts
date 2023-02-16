import { Trip } from "../../../models";

export interface GetTripsOfUserResult {
  listTrips: {
    items: Trip[];
  };
}
