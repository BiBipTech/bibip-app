import Mapbox from "@rnmapbox/maps";
import {
  Dispatch,
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { View } from "react-native";
import { CameraRef } from "@rnmapbox/maps/lib/typescript/components/Camera";
import ChargeStations from "../../../../../assets/beefull-list.json";
import { LatLng } from "react-native-maps";
import { Car } from "../../../../models";
import { BeefullStation } from "../../InformationBox/BeefullInformationBox/BeefullInformationBox";
import { getDirections } from "../../../../utils/api/mapbox";

interface CarMapProps {
  onMarkerSelect: () => void;
  onMapPress: () => void;
  setLocation: Dispatch<React.SetStateAction<LatLng | undefined>>;
  cars: Car[] | undefined;
  setCarInfo: Dispatch<React.SetStateAction<number>>;
  setBeefullInfo: Dispatch<React.SetStateAction<number>>;
  setSelectedBeefullStation: Dispatch<
    React.SetStateAction<BeefullStation | null>
  >;
}

const CarMap: FunctionComponent<CarMapProps> = ({
  onMarkerSelect,
  onMapPress,
  setLocation,
  cars,
  setBeefullInfo,
  setSelectedBeefullStation,
  setCarInfo,
}) => {
  const [cameraRef, setCameraRef] = useState<CameraRef | null>(null);
  const [loc, setLoc] = useState<number[]>([]);

  const isLocationSet = useRef(false);

  const [userLocationRef, setUserLocationRef] =
    useState<Mapbox.UserLocation | null>(null);

  const mapRef = useRef<Mapbox.MapView>(null);

  const [images, setImages] = useState({
    stationIcon: require("../../../../../assets/beefull-marker.png"),
    carIcon: require("../../../../../assets/marker-icon.png"),
  });

  // map related callback references
  const camera = useCallback((node: CameraRef) => {
    setCameraRef(node);
  }, []);
  const userLocation = useCallback((node: Mapbox.UserLocation) => {
    setUserLocationRef(node);
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

  const Cars = cars?.map((car) => ({
    type: "Feature",
    properties: {
      icon: "carIcon",
    },
    geometry: {
      type: "Point",
      coordinates: [car.location?.lng, car.location?.lat],
    },
  })) ?? [
    {
      type: "Feature",
      properties: {
        icon: "stationIcon",
      },
      geometry: {
        type: "Point",
        coordinates: [29, 41],
      },
    },
  ];

  return (
    <View
      className="w-full h-full"
      style={{
        zIndex: -1,
      }}
    >
      <Mapbox.MapView
        ref={mapRef}
        onPress={onMapPress}
        className="w-full h-full"
        styleURL="mapbox://styles/eyub2001/clk2pmr3g00g301pf23265zbw"
      >
        <Mapbox.ShapeSource
          shape={JSON.parse(
            JSON.stringify({
              type: "FeatureCollection",
              features: [...Cars, ...ChargeStations.features],
            })
          )}
          id="symbolLocationSource"
          hitbox={{ width: 18, height: 18 }}
          onPress={async (point) => {
            if (point.features.length === 1) {
              const geometry = point.features[0].geometry as {
                coordinates: [number, number];
                type: string;
              };
              const { icon, name, address, id } =
                point.features[0].properties ?? {};

              if (icon === "stationIcon") {
                const res = await getDirections(
                  `${loc[0]}%2C${loc[1]}`,
                  `${geometry.coordinates[0]}%2C${geometry.coordinates[1]}`
                );
                const { distance, duration } = res.routes[0];

                const beefullStation = {
                  name,
                  address,
                  distance: (distance / 1000).toFixed(1),
                  duration: (duration / 60).toFixed(1),
                };
                setSelectedBeefullStation(beefullStation);
                onMarkerSelect();
                setBeefullInfo(1);
              }

              cameraRef?.setCamera({
                centerCoordinate: geometry.coordinates,
                zoomLevel: 16,
                animationDuration: 750,
              });
              return;
            }

            const currentZoom = await mapRef.current?.getZoom();
            cameraRef?.setCamera({
              centerCoordinate: [
                point.coordinates.longitude,
                point.coordinates.latitude,
              ],
              zoomLevel: (currentZoom ?? 13) + 1,
            });
          }}
          clusterRadius={50}
          clusterMaxZoomLevel={14}
          cluster
        >
          <Mapbox.SymbolLayer
            id="pointCount"
            style={layerStyles.clusterCount}
          />
          <Mapbox.CircleLayer
            id="clusteredPoints"
            belowLayerID="pointCount"
            filter={["has", "point_count"]}
            style={{
              circlePitchAlignment: "map",
              circleColor: [
                "step",
                ["get", "point_count"],
                "#51bbd6",
                100,
                "#f1f075",
                250,
                "#f28cb1",
                750,
                "#ff0000",
              ],
              circleRadius: [
                "step",
                ["get", "point_count"],
                20,
                100,
                25,
                250,
                30,
                750,
                40,
              ],
              circleOpacity: 0.84,
              circleStrokeWidth: 0,
              circleStrokeColor: "blue",
            }}
          />
          <Mapbox.Images images={images} onImageMissing={(imageKey) => {}} />
          <Mapbox.SymbolLayer
            id="singlePoint"
            filter={["!has", "point_count"]}
            style={{
              iconImage: ["get", "icon"],
              iconSize: [
                "match",
                ["get", "icon"],
                "stationIcon",
                0.09,
                "carIcon",
                0.6,
                1,
              ],
            }}
          />
        </Mapbox.ShapeSource>

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
