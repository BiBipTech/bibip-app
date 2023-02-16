import { LatLng } from "react-native-maps";
import { awsPost } from "../../utils/aws/api";
import { TRIP_API } from "@env";

export const startTrip = (
  username: string,
  carId: string,
  location: LatLng,
  token: string
) => {
  return awsPost(
    `${TRIP_API}/startTripForUser`,
    {
      username: username,
      carId: carId,
      location: {
        lat: location.latitude,
        lng: location.longitude,
      },
    },
    token
  );
};
