import { FunctionComponent, useRef } from "react";
import { Text, View } from "react-native";
import ChargeStationInformationBox from "../components/views/InformationBox/ChargeStationInformationBox/ChargeStationInformationBox";
import Mapbox, { UserLocationRenderMode } from "@rnmapbox/maps";
import { TouchableOpacity } from "react-native-gesture-handler";
import MarkerIcon from "../../assets/marker-icon.svg";
interface TestProps {}

Mapbox.setAccessToken(
  "pk.eyJ1IjoiZXl1YjIwMDEiLCJhIjoiY2xpeDYydThxMDR3YzNzcW10cjNoeXI2dSJ9.S8sjCUJxSfbzIbOj-7vWNA"
);

const Test: FunctionComponent<TestProps> = () => {
  const map = useRef<Mapbox.MapView>(null);
  const camera = useRef<Mapbox.Camera>(null);
  const userLocation = useRef<Mapbox.UserLocation>(null);

  return (
    <View className="">
      <Mapbox.MapView
        className="w-full h-full -z-10"
        onPress={(e) => {
          console.log(e);
        }}
        styleURL="mapbox://styles/eyub2001/clk2pmr3g00g301pf23265zbw"
        ref={map}
      >
        <Mapbox.UserLocation ref={userLocation} animated />
        <Mapbox.Camera
          ref={camera}
          animationMode="moveTo"
          animationDuration={250}
        />
        <Mapbox.MarkerView coordinate={[29.01685781844475, 41.11086392747893]}>
          <MarkerIcon width={75} height={75} />
        </Mapbox.MarkerView>
      </Mapbox.MapView>
      <View className="absolute bottom-16 left-16">
        <TouchableOpacity
          onPress={async () => {
            console.log(userLocation.current?.state);
            const coords = userLocation.current?.state.coordinates;
            camera.current?.setCamera({
              centerCoordinate: coords ?? [],
              zoomLevel: 17,
              animationDuration: 1000,
              animationMode: "flyTo",
            });
          }}
          className="rounded-full bg-bibip-green-500 w-12 h-12"
        />
      </View>
    </View>
  );
};

export default Test;
