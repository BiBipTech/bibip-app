import { Dispatch, RefObject, SetStateAction } from "react";
import MapView, {
  LatLng,
  MarkerPressEvent,
  UserLocationChangeEvent,
} from "react-native-maps";

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
