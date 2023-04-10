import { GetCarResult, PhotoType, UpdateCarResult } from "./TripEnd.type";
import * as ImageManipulator from "expo-image-manipulator";
import { SaveFormat } from "expo-image-manipulator";
import { API, Storage } from "aws-amplify";
import { Alert } from "react-native";
import * as Location from "expo-location";
import { endTrip } from "../Trip/Trip.action";
import { AxiosError } from "axios";
import { UserContextType } from "../../../utils/context/UserContext";
import { getTripStatus } from "../../../utils/aws/api";
import { TripStackParamList } from "../../../../Router";
import { StackNavigationProp } from "@react-navigation/stack";
import * as mutations from "../../../graphql/mutations";
import * as queries from "../../../graphql/queries";

import gql from "../../../utils/gql/gql";

export const uploadPhoto = async (
  photo: {
    type: PhotoType;
    value: string;
  },
  username: string,
  date: string
) => {
  const compressedPhotoUri = (await compressPhoto(photo.value)).uri;
  const compressedPhoto = await getPhotoBlob(compressedPhotoUri);
  return await Storage.put(
    `${username}/${date}/${photo.type}`,
    compressedPhoto
  );
};

const compressPhoto = async (uri: string) => {
  return await ImageManipulator.manipulateAsync(uri, [], {
    compress: 0.25,
    format: SaveFormat.JPEG,
  });
};

const getPhotoBlob = async (uri: string) => {
  const photo = await fetch(uri);
  return await photo.blob();
};

export const onEndTrip = async (
  data: { type: PhotoType; value: string }[],
  userContext: UserContextType,
  carId: string,
  waypoints: { lat: number; lng: number }[],
  navigation: StackNavigationProp<TripStackParamList, "TripEnd", undefined>
) => {
  let isValid = true;

  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    if (element.value === "") {
      Alert.alert("Eksik fotoğraf!", "Lütfen bütün fotoğrafları yükle!", [
        {
          text: "Tamam",
        },
      ]);
      isValid = false;
      break;
    }
  }
  if (!isValid) return;
  const date = new Date();
  data.forEach(async (p) => {
    await uploadPhoto(
      p,
      userContext.user?.getUsername()!,
      date.toISOString()
    ).then((val) => {});
  });

  const lastLocation = await Location.getCurrentPositionAsync();
  await updateCarLocation(carId, lastLocation);
  const res = await endTrip(
    userContext.user?.getUsername()!,
    userContext.token!,
    carId,
    lastLocation,
    waypoints
  );

  if (res.status === 200) {
    navigation.navigate("TripSummary", { tripId: res.data.tripId });
  } else {
    userContext.updateToken();
    Alert.alert("Tekrar dene!", "Lütfen tekrar dene!", [
      {
        text: "Tamam",
      },
    ]);
  }
  return;
};

export const updateCarLocation = async (
  carId: string,
  location: Location.LocationObject
) => {
  const currentCar = await gql<GetCarResult>({
    query: queries.getCar,
    variables: {
      id: carId,
    },
  });
  await gql<UpdateCarResult>({
    query: mutations.updateCar,
    variables: {
      input: {
        id: carId,
        inUse: false,
        location: {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        },
        _version: currentCar.data?.getCar._version!,
      },
    },
  });
};

export const photoTypeString = (type: "BACK" | "FRONT" | "RIGHT" | "LEFT") => {
  switch (type) {
    case "BACK":
      return "Arka";
    case "FRONT":
      return "Ön";
    case "LEFT":
      return "Sol";
    case "RIGHT":
      return "Sağ";
    default:
      break;
  }
};
