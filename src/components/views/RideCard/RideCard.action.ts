import { TRIP_API } from "@env";
import { awsGet } from "../../../utils/aws/api";

export const getTripPhoto = async (tripId: string) => {
  return await awsGet(`${TRIP_API}/getRoadImageForTrip/${tripId}`, "");
};

export const formatDate = (date: string) => {
  return new Date(date);
};
