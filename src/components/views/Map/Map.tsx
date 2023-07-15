import { useForegroundPermissions } from "expo-location";
import {
  FunctionComponent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Platform, Pressable, View } from "react-native";
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
import Mapbox from "@rnmapbox/maps";
import { LatLng, MapViewProps } from "react-native-maps";

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
  const mapRef = useRef<Mapbox.MapView>(null);
  const camera = useRef<Mapbox.Camera>(null);
  const userLocation = useRef<Mapbox.UserLocation>(null);

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
    // if (locationFocused) return;
    // if (userLocation) {
    //   animateToLocation(mapRef, 15, userLocation);
    //   setLocationFocused(true);
    //   if (onLocationSet) {
    //     onLocationSet(userLocation);
    //   }
    // }
  }, [userLocation]);

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
          console.log(e.geometry);
        }}
      >
        {markers &&
          markers.map((car) => {
            console.log(car.id);

            return (
              <Mapbox.MarkerView
                coordinate={[car.location!.lat, car.location!.lng]}
                // onPress={onMarker ? () => onMarker(car) : undefined}
                key={car.id}
              >
                <MarkerIcon height={75} width={75} onPress={() => {}} />
              </Mapbox.MarkerView>
            );
          })}
        <Mapbox.Camera
          ref={camera}
          animationMode="moveTo"
          animationDuration={250}
        />
        <Mapbox.UserLocation ref={userLocation} />
      </Mapbox.MapView>
      <View className="absolute bottom-12 left-12">
        <BiBipIconButton
          intent="inverted"
          buttonSize="medium"
          onPress={() => {
            const coords = userLocation.current?.state.coordinates;
            camera.current?.setCamera({
              centerCoordinate: coords ?? [],
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
