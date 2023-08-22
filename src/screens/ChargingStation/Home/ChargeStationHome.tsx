import { Dimensions, Text, View } from "react-native";
import React, { FC, useContext, useEffect, useRef, useState } from "react";
import BiBipIconButton from "../../../components/buttons/BiBipIconButton/BiBipIconButton";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppDrawerChargeStationHomeStackCompositeProps } from "../../../../Router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Spinner from "react-native-loading-spinner-overlay";
import { useQuery } from "react-query";
import CarMap from "../../../components/views/Map/CarMap/CarMap";
import { LatLng } from "react-native-maps";
import Landing from "../../Landing/Landing";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import BottomSheet from "@gorhom/bottom-sheet";
import ChargeStationInformationBox from "../../../components/views/InformationBox/ChargeStationInformationBox/ChargeStationInformationBox";
import ChargeStationMap from "../../../components/views/Map/ChargeStationMap/ChargeStationMap";
import { promiseWithLoader } from "../../../utils/aws/api";
import { getDirections } from "../../../utils/api/mapbox";

const ChargeStationHome: FC<
  AppDrawerChargeStationHomeStackCompositeProps<"ChargeStationHome">
> = ({ route, navigation }) => {
  const [location, setLocation] = useState<LatLng>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStation, setSelectedStation] = useState<{
    name: string;
    distance: string;
    duration: string;
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const modalPosition = useSharedValue(0);
  const infoBoxShown = useSharedValue(0);
  const windowHeight = Dimensions.get("window").height;

  const modalLowerBound = windowHeight * 0.96;
  const modalUpperBound = windowHeight * 0.6;

  const animated = useAnimatedStyle(() => {
    const value =
      (modalPosition.value - modalUpperBound) /
      (modalLowerBound - modalUpperBound);
    console.log(modalPosition.value);

    return {
      transform: [
        {
          translateX: (1 - value) * 200,
        },
      ],
      zIndex: -1,
    };
  }, [modalPosition]);

  const animatedDrawerButton = useAnimatedStyle(() => {
    console.log(infoBoxShown.value);

    return {
      transform: [
        {
          translateY: withTiming(infoBoxShown.value * 250),
        },
      ],
    };
  }, [infoBoxShown]);

  const animatedInformationBox = useAnimatedStyle(() => {
    console.log(infoBoxShown.value);

    return {
      transform: [
        {
          translateY: withTiming((1 - infoBoxShown.value) * -250),
        },
      ],
      opacity: withTiming(infoBoxShown.value),
    };
  }, [infoBoxShown]);

  return (
    <SafeAreaProvider>
      <View className="items-center justify-center h-full w-full flex-1">
        <Spinner visible={isLoading} />
        <Landing
          hideInfoBox={() => {
            infoBoxShown.value = 0;
          }}
          handle={(i) => {}}
          navigate={navigation.navigate}
          modalPosition={modalPosition}
          bottomSheetRef={bottomSheetRef}
        />
        <ChargeStationMap
          setLocation={setLocation}
          onMarkerSelect={async (cs) => {
            const res = await promiseWithLoader(
              setIsLoading,
              getDirections(
                `${location?.longitude}%2C${location?.latitude}`,
                `${cs.coords.longitude}%2C${cs.coords.latitude}`
              )
            );
            const { distance, duration } = res.routes[0];

            setSelectedStation({
              name: cs.name,
              distance: (distance / 1000).toFixed(1),
              duration: (duration / 60).toFixed(1),
              latitude: cs.coords.latitude,
              longitude: cs.coords.longitude,
              address: `${cs.address.split(", ")[0]}, ${
                cs.address.split(", ")[1]
              }`,
            });
            bottomSheetRef.current?.collapse();
            infoBoxShown.value = 1;
            return res.routes[0].geometry.coordinates;
          }}
          onMapPress={() => {
            bottomSheetRef.current?.collapse();
            infoBoxShown.value = 0;
          }}
        />
        <Animated.View
          className={"absolute top-10 w-full px-4"}
          style={animatedInformationBox}
        >
          <ChargeStationInformationBox
            selectedStation={selectedStation}
            onComment={() => {
              navigation.navigate("ChargeStationComment");
            }}
          />
        </Animated.View>
        <Animated.View
          className={`absolute left-7 top-16`}
          style={animatedDrawerButton}
        >
          <BiBipIconButton
            buttonSize="small"
            onPress={() => {
              navigation.openDrawer();
            }}
          >
            <Ionicons name="menu" color="white" size={32} />
          </BiBipIconButton>
        </Animated.View>

        <Animated.View className="absolute right-8 bottom-24" style={animated}>
          <BiBipIconButton
            buttonSize="large"
            intent="primary"
            disabled={location === undefined}
            onPress={async () => {}}
          >
            <Ionicons name="qr-code-outline" color="white" size={48} />
          </BiBipIconButton>
        </Animated.View>
      </View>
    </SafeAreaProvider>
  );
};

export default ChargeStationHome;
