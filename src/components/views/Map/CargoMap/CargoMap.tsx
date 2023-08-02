import React, {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useRef,
} from "react";
import { View } from "react-native";
import BiBipIconButton from "../../../buttons/BiBipIconButton/BiBipIconButton";
import Mapbox from "@rnmapbox/maps";
import { CameraRef } from "@rnmapbox/maps/lib/typescript/components/Camera";
import { LatLng } from "react-native-maps";
import { ChargeStationProperties } from "../ChargeStationMap/ChargeStationMap";

interface CargoMapProps {
  onMarkerSelect: (chargeStation: ChargeStationProperties) => void;
  onMapPress: () => void;
  setLocation: Dispatch<SetStateAction<LatLng | undefined>>;
}

const CargoMap: FunctionComponent<CargoMapProps> = ({
  onMapPress,
  setLocation,
}) => {
  const camera = useRef<CameraRef>(null);

  const isLocationSet = useRef(false);

  return (
    <View
      className="absolute items-center justify-center h-full w-full flex-1"
      style={{
        zIndex: -1,
      }}
    >
      <Mapbox.MapView
        className="w-full h-full"
        styleURL="mapbox://styles/eyub2001/clk2pmr3g00g301pf23265zbw"
        onPress={(e) => {
          if (onMapPress) onMapPress();
        }}
        compassEnabled
        compassViewPosition={1}
        scaleBarEnabled={false}
        compassFadeWhenNorth
      >
        <Mapbox.Camera
          ref={camera}
          animationMode="moveTo"
          animationDuration={250}
        />
        <Mapbox.UserLocation
          showsUserHeadingIndicator
          onUpdate={(location) => {
            if (isLocationSet.current || !camera.current) return;

            setLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
            camera.current?.setCamera({
              centerCoordinate: [
                location.coords.longitude,
                location.coords.latitude,
              ],
              zoomLevel: 16,
              animationDuration: 1000,
            });

            isLocationSet.current = true;
          }}
        />
      </Mapbox.MapView>
    </View>
  );
};

export default CargoMap;
