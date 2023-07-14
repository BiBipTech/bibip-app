import { Dispatch, RefObject, SetStateAction } from "react";
import MapView, {
  UserLocationChangeEvent,
  LatLng,
  MarkerPressEvent,
} from "react-native-maps";
import * as queries from "../../../graphql/queries";
import { Car } from "../../../models";
import gql from "../../../utils/gql/gql";
import { ListCarsResult } from "./ChargeStationHome.type";
import axios from "axios";

export const getCurrentLocation = (
  e: UserLocationChangeEvent,
  setUserLocation: Dispatch<SetStateAction<LatLng | undefined>>
): void => {
  const coordinate = e.nativeEvent.coordinate;
  if (coordinate)
    setUserLocation({
      longitude: coordinate.longitude,
      latitude: coordinate.latitude,
    });
  else {
    setUserLocation({
      latitude: 0,
      longitude: 0,
    });
  }
};

export const onMarkerSelect = (
  e: MarkerPressEvent,
  mapRef: RefObject<MapView>
) => {
  animateToLocation(mapRef, 18, {
    latitude: e.nativeEvent.coordinate.latitude,
    longitude: e.nativeEvent.coordinate.longitude,
  });
};

export const animateToLocation = (
  mapRef: RefObject<MapView>,
  zoom: number,
  location: LatLng
) => {
  mapRef.current!.animateCamera({
    center: {
      latitude: location.latitude,
      longitude: location.longitude,
    },
    zoom: zoom,
  });
};

export const listCars = async (
  setCars: Dispatch<SetStateAction<Car[] | undefined>>
) => {
  const allCars = await gql<ListCarsResult>({ query: queries.listCars });

  if (allCars.data) setCars(allCars.data.listCars.items);
};

export const unlockCar = async (token: string, topic: string) => {
  return axios({
    method: "post",
    url: "https://yrck9a42ef.execute-api.eu-central-1.amazonaws.com/dev/publish",
    data: {
      topic: topic,
      message: {
        locked: false,
      },
    },
    headers: {
      "x-aws-cognito-token": token,
    },
  });
};

export const findCarFromLocation = (
  cars: Car[] | undefined,
  location: LatLng
) => {
  return cars?.find((car) => {
    return (
      car.location?.lat === location.latitude &&
      car.location?.lng === location.longitude
    );
  });
};
