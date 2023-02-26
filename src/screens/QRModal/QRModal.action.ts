import { LatLng } from "react-native-maps";
import { awsPost } from "../../utils/aws/api";
import { TRIP_API } from "@env";
import { unlockCar } from "../Home/Home.action";

export const startTrip = async (
  username: string,
  carId: string,
  location: LatLng,
  token: string
) => {
  await mqttStart(carId, token);
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

export const mqttStart = (carId: string, token: string) => {
  return unlockCar(token, `bibip/${carId}/locked`);
};
