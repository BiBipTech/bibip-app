import { Trip } from "../../../models";

export interface GetTripResult {
  getTrip: TripWithVersion;
}

export interface UpdateTripResult {
  updateTrip: TripWithVersion;
}

export interface TripWithVersion extends Trip {
  _version: string;
}
