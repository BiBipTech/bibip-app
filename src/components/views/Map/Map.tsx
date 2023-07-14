import { useForegroundPermissions } from "expo-location";
import {
  FunctionComponent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Platform, Pressable, View } from "react-native";
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
import { SvgProps } from "react-native-svg";

interface MapProps extends MapViewProps {
  markers?: Car[];
  onLocationSet?: (location: LatLng) => void;
  locationInterval?: number;
  onMarker?: (car: Car) => void;
  MarkerIcon: React.FC<SvgProps>;
}

const CustomMapView: FunctionComponent<MapProps> = ({
  markers,
  onLocationSet,
  onMarker,
  MarkerIcon,
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
        customMapStyle={[
          {
            elementType: "geometry",
            stylers: [
              {
                color: "#242f3e",
              },
            ],
          },
          {
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#746855",
              },
            ],
          },
          {
            elementType: "labels.text.stroke",
            stylers: [
              {
                color: "#242f3e",
              },
            ],
          },
          {
            featureType: "administrative",
            elementType: "geometry",
            stylers: [
              {
                visibility: "off",
              },
            ],
          },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#d59563",
              },
            ],
          },
          {
            featureType: "poi",
            stylers: [
              {
                visibility: "off",
              },
            ],
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#d59563",
              },
            ],
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [
              {
                color: "#263c3f",
              },
            ],
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#6b9a76",
              },
            ],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [
              {
                color: "#38414e",
              },
            ],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [
              {
                color: "#212a37",
              },
            ],
          },
          {
            featureType: "road",
            elementType: "labels.icon",
            stylers: [
              {
                visibility: "off",
              },
            ],
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#9ca5b3",
              },
            ],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [
              {
                color: "#746855",
              },
            ],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [
              {
                color: "#1f2835",
              },
            ],
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#f3d19c",
              },
            ],
          },
          {
            featureType: "transit",
            stylers: [
              {
                visibility: "off",
              },
            ],
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [
              {
                color: "#2f3948",
              },
            ],
          },
          {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#d59563",
              },
            ],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [
              {
                color: "#17263c",
              },
            ],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#515c6d",
              },
            ],
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [
              {
                color: "#17263c",
              },
            ],
          },
        ]}
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
