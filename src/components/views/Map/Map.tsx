import {
  Accuracy,
  LocationAccuracy,
  getCurrentPositionAsync,
  getLastKnownPositionAsync,
  useForegroundPermissions,
} from "expo-location";
import {
  FunctionComponent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Platform, Pressable, View } from "react-native";
import { Car } from "../../../models";
import useCustomTailwind from "../../../utils/hooks/useCustomTailwind";
import BiBipIconButton from "../../buttons/BiBipIconButton/BiBipIconButton";

import Ionicons from "@expo/vector-icons/Ionicons";
import MarkerIcon from "../../../../assets/marker-icon.svg";
import { SvgProps } from "react-native-svg";
import Mapbox from "@rnmapbox/maps";
import { LatLng, MapViewProps } from "react-native-maps";

interface MapProps extends MapViewProps {
  markers?: Car[];
  onLocationSet?: (location: LatLng) => void;
  locationInterval?: number;
  onMarker?: (car: Car) => void;
  MarkerIcon: React.FC<SvgProps>;
  onMarkerSelect?: () => void;
  onMapPress?: () => void;
}

const CustomMapView: FunctionComponent<MapProps> = ({
  markers,
  onLocationSet,
  onMarker,
  MarkerIcon,
  onMarkerSelect,
  onMapPress,
  ...props
}) => {
  const mapRef = useRef<Mapbox.MapView>(null);
  const camera = useRef<Mapbox.Camera>(null);

  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [locationFocused, setLocationFocused] = useState(false);

  const [status, requestPermission] = useForegroundPermissions();

  const animateToLocation = useCallback(() => {
    camera.current?.setCamera({
      centerCoordinate: [
        userLocation?.longitude ?? 0,
        userLocation?.latitude ?? 0,
      ],
      animationDuration: 500,
      zoomLevel: 16,
    });
  }, [camera, userLocation]);

  useEffect(() => {
    getCurrentPositionAsync({
      accuracy: Accuracy.Balanced,
    }).then((val) => {
      console.log(val);

      setUserLocation({
        latitude: val.coords.latitude,
        longitude: val.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    if (status) {
      if (status.status !== "granted") {
        requestPermission();
      }
    }
  }, []);

  useEffect(() => {
    console.log(userLocation, locationFocused);

    if (locationFocused || !userLocation || camera.current === null) return;
    if (userLocation) {
      animateToLocation();
      setLocationFocused(true);
      if (onLocationSet) {
        onLocationSet(userLocation);
      }
    }
  }, [userLocation, camera.current]);

  return (
    <View
      className="absolute items-center justify-center h-full w-full flex-1"
      style={{
        zIndex: -1,
      }}
    >
      <Mapbox.MapView
        ref={mapRef}
        className="w-full h-full"
        styleURL="mapbox://styles/eyub2001/clk2pmr3g00g301pf23265zbw"
        onPress={(e) => {
          if (onMapPress) onMapPress();
        }}
      >
        {markers &&
          markers.map((car) => {
            return (
              <Mapbox.PointAnnotation
                coordinate={[car.location!.lng, car.location!.lat]}
                // onPress={onMarker ? () => onMarker(car) : undefined}
                id={car.id}
                anchor={{
                  x: 0.5,
                  y: 1,
                }}
                onSelected={(payload) => {
                  if (onMarkerSelect) onMarkerSelect();
                }}
              >
                <MarkerIcon height={75} width={75} onPress={() => {}} />
              </Mapbox.PointAnnotation>
            );
          })}
        <Mapbox.Camera
          ref={camera}
          animationMode="moveTo"
          animationDuration={250}
        />
        <Mapbox.UserLocation />
      </Mapbox.MapView>
      <View className="absolute bottom-12 left-12">
        <BiBipIconButton
          intent="inverted"
          buttonSize="medium"
          onPress={() => {
            camera.current?.setCamera({
              centerCoordinate: [
                userLocation?.longitude ?? 0,
                userLocation?.latitude ?? 0,
              ],
              zoomLevel: 17,
              animationDuration: 1000,
              animationMode: "flyTo",
            });
          }}
        >
          <Ionicons name="locate" color="#23a65e" size={32} />
        </BiBipIconButton>
      </View>
    </View>
  );
};

export default CustomMapView;
