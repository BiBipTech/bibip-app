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
      endLocation: {
        lat: lastLocation.coords.latitude,
        lng: lastLocation.coords.longitude,
      },
      waypoints: waypoints,
    },
    token
  );
};

export const getCarId = (username: string, token: string) => {
  return awsGet(`${TRIP_API}/car-id/${username}`, token);
};
