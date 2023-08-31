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
// import ChargeStations from "../../../../../assets/zes-list.json";
import { LatLng } from "react-native-maps";

export interface ChargeStationProperties {
  id: number;
  name: string;
  icon: string;
  coords: {
    latitude: number;
    longitude: number;
  };
  address: string;
}

const ChargeStations = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Olcayto Bosch Araç Servisi",
        id: 506,
        icon: "stationIcon",
        address: "Aos 11. Sokak, Sarıyer",
      },
      geometry: { type: "Point", coordinates: [29.017303, 41.1142] },
    },
  ],
};

interface ChargeStationMapProps {
  onMarkerSelect: (
    chargeStation: ChargeStationProperties
  ) => Promise<number[][]>;
  onMapPress: () => void;
  setLocation: Dispatch<React.SetStateAction<LatLng | undefined>>;
}

const ChargeStationMap: FunctionComponent<ChargeStationMapProps> = ({
  onMarkerSelect,
  onMapPress,
  setLocation,
}) => {
  const [cameraRef, setCameraRef] = useState<CameraRef | null>(null);
  const [userLocationRef, setUserLocationRef] =
    useState<Mapbox.UserLocation | null>(null);

  const [locationSet, setLocationSet] = useState(false);

  const mapRef = useRef<Mapbox.MapView>(null);

  const [images, setImages] = useState({
    stationIcon: require("../../../../../assets/station-marker-icon.png"),
  });

  const [directions, setDirections] = useState<number[][] | null>(null);

  // map related callback references
  const camera = useCallback((node: CameraRef) => {
    setCameraRef(node);
  }, []);
  const userLocation = useCallback((node: Mapbox.UserLocation) => {
    setUserLocationRef(node);
  }, []);

  useEffect(() => {
    console.log("ChargeStationMap.tsx: useEffect: images: ", Math.random());
  });

  useEffect(() => {
    if (!cameraRef || !userLocationRef) return;

    cameraRef.setCamera({
      centerCoordinate: userLocationRef.state.coordinates ?? [],
      zoomLevel: 16,
      animationDuration: 1000,
    });
  }, [userLocationRef, cameraRef]);

  return (
    <View
      className="w-full h-full"
      style={{
        zIndex: -1,
      }}
    >
      <Mapbox.MapView
        ref={mapRef}
        onPress={() => {
          onMapPress();
          setDirections(null);
        }}
        className="w-full h-full"
        styleURL="mapbox://styles/eyub2001/clk2pmr3g00g301pf23265zbw"
      >
        <Mapbox.ShapeSource
          shape={JSON.parse(JSON.stringify(ChargeStations))}
          id="symbolLocationSource"
          hitbox={{ width: 18, height: 18 }}
          onPress={async (point) => {
            if (point.features.length === 1) {
              const geometry = point.features[0].geometry as {
                coordinates: [number, number];
                type: string;
              };
              const properties = point.features[0].properties ?? {};
              const coordinates = await onMarkerSelect({
                coords: {
                  latitude: geometry.coordinates[1],
                  longitude: geometry.coordinates[0],
                },
                id: properties.id,
                name: properties.name,
                icon: properties.icon,
                address: properties.address,
              });
              setDirections(coordinates);

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
                0.6,
                "airport-15",
                1.2,
                1,
              ],
            }}
          />
        </Mapbox.ShapeSource>
        {directions && (
          <Mapbox.ShapeSource
            id="navigationRoute"
            shape={{
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: directions,
              },
            }}
          >
            <Mapbox.LineLayer
              id="route"
              sourceID="navigationRoute"
              style={{
                lineColor: "#f62424",
                lineWidth: 4,
                lineJoin: "round",
                lineCap: "round",
                lineDasharray: [1, 2, 3],
              }}
            />
          </Mapbox.ShapeSource>
        )}
        <Mapbox.UserLocation
          visible
          onUpdate={(location) => {
            if (locationSet) return;

            setLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
            setLocationSet(true); // prevent location from being set again
          }}
          ref={userLocation}
        />
        <Mapbox.Camera ref={camera} />
      </Mapbox.MapView>
    </View>
  );
};

export default ChargeStationMap;

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
