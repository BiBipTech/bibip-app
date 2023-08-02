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
  withSpring,
  withTiming,
} from "react-native-reanimated";
import BottomSheet from "@gorhom/bottom-sheet";
import ChargeStationInformationBox from "../../../components/views/InformationBox/ChargeStationInformationBox/ChargeStationInformationBox";
import { Motion } from "@legendapp/motion";
import MarkerIcon from "../../../../assets/station-marker-icon.svg";
import ChargeStationMap from "../../../components/views/Map/ChargeStationMap/ChargeStationMap";
import { promiseWithLoader } from "../../../utils/aws/api";
import {
  getDirections,
  getIsochrone,
  getReverseGeocode,
} from "../../../utils/api/mapbox";
import ChargeStationCarousel from "../../../components/views/Carousel/ChargeStationCarousel/ChargeStationCarousel";

const ChargeStationHome: FC<
  AppDrawerChargeStationHomeStackCompositeProps<"ChargeStationHome">
> = ({ route, navigation }) => {
  const [location, setLocation] = useState<LatLng>();
  const [isLoading, setIsLoading] = useState(false);
  const [infoBoxShown, setInfoBoxShown] = useState(0);
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
  const windowHeight = Dimensions.get("window").height;

  const modalLowerBound = windowHeight * 0.96;
  const modalUpperBound = windowHeight * 0.6;

  const animated = useAnimatedStyle(() => {
    const value =
      (modalPosition.value - modalUpperBound) /
      (modalLowerBound - modalUpperBound);

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
    return {
      transform: [
        {
          translateY: withTiming(infoBoxShown * 250),
        },
      ],
    };
  });

  const animatedInformationBox = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming((1 - infoBoxShown) * -250),
        },
      ],
      opacity: withTiming(infoBoxShown),
    };
  });

  return (
    <SafeAreaProvider>
      <View className="items-center justify-center h-full w-full flex-1">
        <Spinner visible={isLoading} />
        <Landing
          hideInfoBox={() => {
            setInfoBoxShown(0);
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
            setInfoBoxShown(1);
            return res.routes[0].geometry.coordinates;
          }}
          onMapPress={() => {
            bottomSheetRef.current?.collapse();
            setInfoBoxShown(0);
          }}
        />
        <Animated.View
          className={"absolute top-10 w-full px-4"}
          style={animatedInformationBox}
        >
          <ChargeStationInformationBox selectedStation={selectedStation} />
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
