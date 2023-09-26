import Mapbox from "@rnmapbox/maps";
import {
  Dispatch,
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { CameraRef } from "@rnmapbox/maps/lib/typescript/components/Camera";
import { LatLng } from "react-native-maps";
import { Car } from "../../../../models";
import { useForegroundPermissions } from "expo-location";
import CarMarkerIcon from "../../../../../assets/marker-icon.svg";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface CarMapProps {
  onMapPress: () => void;
  setLocation: Dispatch<React.SetStateAction<LatLng | undefined>>;
  cars: (Car & { _version: number })[] | undefined;
  onCarSelect: (car: Car & { _version: number }) => void;
}

const CarMap: FunctionComponent<CarMapProps> = ({
  onMapPress,
  setLocation,
  cars,
  onCarSelect,
}) => {
  const [cameraRef, setCameraRef] = useState<CameraRef | null>(null);
  const [loc, setLoc] = useState<number[]>([]);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const [status, requestPermission] = useForegroundPermissions();

  const isLocationSet = useRef(false);

  const [userLocationRef, setUserLocationRef] =
    useState<Mapbox.UserLocation | null>(null);

  const mapRef = useRef<Mapbox.MapView>(null);

  // map related callback references
  const camera = useCallback((node: CameraRef) => {
    setCameraRef(node);
  }, []);
  const userLocation = useCallback((node: Mapbox.UserLocation) => {
    setUserLocationRef(node);
  }, []);

  useEffect(() => {
    if (status?.granted) return;

    requestPermission().then((val) => {
      if (val.granted || !val.canAskAgain) setPermissionGranted(true);

      requestPermission().then((val) => {
        if (val.granted || !val.canAskAgain) setPermissionGranted(true);
      });
    });
  }, []);

  useEffect(() => {
    if (!cameraRef || !userLocationRef) return;
    if (!loc) return;

    cameraRef.setCamera({
      centerCoordinate: userLocationRef.state.coordinates ?? [29, 41],
      zoomLevel: 16,
      animationDuration: 1000,
    });
  }, [userLocationRef, cameraRef, loc]);

  return (
    <View
      className="w-full h-full"
      style={{
        zIndex: -1,
      }}
    >
      {permissionGranted && (
        <Mapbox.MapView
          ref={mapRef}
          onPress={onMapPress}
          className="w-full h-full"
          styleURL="mapbox://styles/eyub2001/clk2pmr3g00g301pf23265zbw"
        >
          {cars?.map((car, index) => (
            <Mapbox.PointAnnotation
              coordinate={[car.location?.lng ?? 0, car.location?.lat ?? 0]}
              id={car.id}
              key={car.id}
              onSelected={(p) => {
                cameraRef?.setCamera({
                  centerCoordinate: [
                    car.location?.lng ?? 0,
                    car.location?.lat ?? 0,
                  ],
                  zoomLevel: 16,
                  animationDuration: 500,
                });

                onCarSelect(car);
              }}
            >
              <CarMarkerIcon width={75} height={75} />
            </Mapbox.PointAnnotation>
          ))}
          <Mapbox.UserLocation
            visible
            onUpdate={(location) => {
              setLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              });
              if (isLocationSet.current) return;
              isLocationSet.current = true;
              setLoc([location.coords.longitude, location.coords.latitude]);
            }}
            ref={userLocation}
          />
          <Mapbox.Camera ref={camera} />
        </Mapbox.MapView>
      )}
      <TouchableOpacity
        onPress={() => {
          cameraRef?.setCamera({
            centerCoordinate: [loc[0], loc[1]],
            zoomLevel: 16,
            animationDuration: 500,
          });
        }}
        className="absolute flex items-center justify-center bottom-28 left-10 w-12 aspect-square bg-cyan-500 rounded-full"
      >
        <MaterialCommunityIcons
          name="navigation-variant-outline"
          size={32}
          color={"white"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CarMap;

const layerStyles = {
  singlePoint: {
    circleColor: "green",
    circleOpacity: 0.84,
    circleStrokeWidth: 2,
    circleStrokeColor: "white",
    circleRadius: 5,
    circlePitchAlignment: "map",
  },
  clusteredPoints: {},
  clusterCount: {
    textField: "{point_count}",
    textSize: 12,
    textColor: "white",
    textPitchAlignment: "map",
  },
};
