import { useForegroundPermissions } from "expo-location";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { Platform, View } from "react-native";
import MapView, { LatLng, MapViewProps, Marker } from "react-native-maps";
import { Car } from "../../../models";
import useCustomTailwind from "../../../utils/hooks/useCustomTailwind";
import BiBipIconButton from "../../buttons/BiBipIconButton/BiBipIconButton";
import {
  animateToLocation,
  getCurrentLocation,
  onMarkerSelect,
} from "./Map.action";
import Ionicons from "@expo/vector-icons/Ionicons";
import MarkerIcon from "../../../../assets/marker-icon.svg";
interface MapProps extends MapViewProps {
  markers?: Car[];
  onLocationSet?: (location: LatLng) => void;
  locationInterval?: number;
  onMarker?: (car: Car) => void;
}

const CustomMapView: FunctionComponent<MapProps> = ({
  markers,
  onLocationSet,
  onMarker,
  ...props
}) => {
  const mapRef = useRef<MapView>(null);

  const [userLocation, setUserLocation] = useState<LatLng>();
  const [locationFocused, setLocationFocused] = useState(false);

  const [status, requestPermission] = useForegroundPermissions();

  useEffect(() => {
    if (status) {
      if (status.status !== "granted") {
        requestPermission();
      }
    }
  }, []);

  useEffect(() => {
    if (locationFocused) return;
    if (userLocation) {
      animateToLocation(mapRef, 15, userLocation);
      setLocationFocused(true);
      if (onLocationSet) {
        onLocationSet(userLocation);
      }
    }
  }, [userLocation]);

  return (
    <View
      className="absolute items-center justify-center h-full w-full flex-1"
      style={{
        zIndex: -1,
      }}
    >
      <MapView
        provider="google"
        style={useCustomTailwind("w-full h-full z-3")}
        onUserLocationChange={(e) => getCurrentLocation(e, setUserLocation)}
        userLocationAnnotationTitle="Hello"
        userLocationUpdateInterval={Platform.OS === "ios" ? undefined : 1000000}
        ref={mapRef}
        showsMyLocationButton={false}
        showsUserLocation
        {...props}
      >
        {markers &&
          markers.map((car) => (
            <Marker
              coordinate={{
                latitude: car.location!.lat,
                longitude: car.location!.lng,
              }}
              onPress={onMarker ? () => onMarker(car) : undefined}
              key={car.id}
            >
              <View className="shadow-md">
                <MarkerIcon height={75} width={75} />
              </View>
            </Marker>
          ))}
      </MapView>
      <View className="absolute bottom-12 left-12">
        <BiBipIconButton
          intent="inverted"
          buttonSize="medium"
          onPress={() => animateToLocation(mapRef, 17, userLocation!)}
        >
          <Ionicons name="locate" color="#23a65e" size={32} />
        </BiBipIconButton>
      </View>
    </View>
  );
};

export default CustomMapView;
