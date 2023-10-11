import { awsGet, awsPost } from "../../../utils/aws/api";
import { TRIP_API } from "@env";
import { LocationObject } from "expo-location";

export const endTrip = (
  username: string,
  token: string,
  carId: string,
  lastLocation: LocationObject,
  waypoints: { lat: number; lng: number }[]
) => {
  return awsPost(
    `${TRIP_API}/endTripForUser`,
    {
      username: username,
      carId: carId,
      timestamp: (+new Date()).toFixed(0),
    },
    token
  );
};

export const getCarId = (username: string, token: string) => {
  return awsGet(`${TRIP_API}/car-id/${username}`, token);
};
