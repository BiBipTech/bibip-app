import { Dimensions, Text, View } from "react-native";
import React, { FC, useContext, useEffect, useRef, useState } from "react";
import BiBipIconButton from "../../../components/buttons/BiBipIconButton/BiBipIconButton";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppDrawerChargeStationHomeStackCompositeProps } from "../../../../Router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Spinner from "react-native-loading-spinner-overlay";
import { useQuery } from "react-query";
import CustomMapView from "../../../components/views/Map/Map";
import { LatLng } from "react-native-maps";
import Landing from "../../Landing/Landing";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import BottomSheet from "@gorhom/bottom-sheet";
import ChargeStationInformationBox from "../../../components/views/InformationBox/ChargeStationInformationBox/ChargeStationInformationBox";
import { Motion } from "@legendapp/motion";
import MarkerIcon from "../../../../assets/station-marker-icon.svg";

const ChargeStationHome: FC<
  AppDrawerChargeStationHomeStackCompositeProps<"ChargeStationHome">
> = ({ route, navigation }) => {
  const [location, setLocation] = useState<LatLng>();
  const [isLoading, setIsLoading] = useState(false);
  const [infoBoxShown, setInfoBoxShown] = useState(0);

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
        <CustomMapView
          MarkerIcon={MarkerIcon}
          onLocationSet={(loc) => {
            setLocation(loc);
          }}
          markers={[
            {
              id: "1",
              location: {
                lat: 41.11178122664561,
                lng: 29.01620543662604,
              },
            },
            {
              id: "2",
              location: {
                lat: 41.11198122664561,
                lng: 29.01600543662604,
              },
            },
            {
              id: "3",
              location: {
                lat: 41.11118122664561,
                lng: 29.01650543662604,
              },
            },
            {
              id: "4",
              location: {
                lat: 41.11318122664561,
                lng: 29.01950543662604,
              },
            },
            {
              id: "5",
              location: {
                lat: 41.11418122664561,
                lng: 29.01250543662604,
              },
            },
            {
              id: "6",
              location: {
                lat: 41.114197334537636,
                lng: 29.01583168655634,
              },
            },
            {
              id: "7",
              location: {
                lat: 41.1135138029715,
                lng: 29.017763547599316,
              },
            },
          ]}
          onMarkerPress={(e) => {
            setInfoBoxShown(1);
          }}
          onPress={(e) => {
            console.log(e.nativeEvent.coordinate);

            bottomSheetRef.current?.collapse();
            setInfoBoxShown(0);
          }}
        />
        <Motion.View
          className={"absolute top-10 w-full px-4"}
          animate={{
            y: infoBoxShown === 1 ? 0 : -250,
            opacity: infoBoxShown === 1 ? 1 : 0,
          }}
          transition={{
            duration: 250,
            speed: 1,
          }}
        >
          <ChargeStationInformationBox />
        </Motion.View>
        <Motion.View
          className={`absolute left-7 top-16`}
          animate={{
            y: infoBoxShown === 1 ? 250 : 0,
          }}
          transition={{
            duration: 250,
          }}
        >
          <BiBipIconButton
            buttonSize="small"
            onPress={() => {
              navigation.openDrawer();
            }}
          >
            <Ionicons name="menu" color="white" size={32} />
          </BiBipIconButton>
        </Motion.View>

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
