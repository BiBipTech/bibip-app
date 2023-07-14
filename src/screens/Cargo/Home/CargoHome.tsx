import { Dimensions, Text, View } from "react-native";
import React, { FC, useContext, useEffect, useRef, useState } from "react";
import BiBipIconButton from "../../../components/buttons/BiBipIconButton/BiBipIconButton";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DrawerScreenProps } from "@react-navigation/drawer";
import {
  AppDrawerCargoHomeStackCompositeProps,
  AppSignedInStackParamList,
  CargoHomeStackParamList,
} from "../../../../Router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Spinner from "react-native-loading-spinner-overlay";
import { useQuery } from "react-query";
import gql from "../../../utils/gql/gql";
import { ListCarsResult } from "./CargoHome.type";
import * as queries from "../../../graphql/queries";
import CustomMapView from "../../../components/views/Map/Map";
import { LatLng } from "react-native-maps";
import Landing from "../../Landing/Landing";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import BottomSheet from "@gorhom/bottom-sheet";
import MarkerIcon from "../../../../assets/marker-icon.svg";

const CargoHome: FC<AppDrawerCargoHomeStackCompositeProps<"CargoHome">> = ({
  route,
  navigation,
}) => {
  const [location, setLocation] = useState<LatLng>();
  const [isLoading, setIsLoading] = useState(false);

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
        />
        <View className={`absolute left-12 top-16`}>
          <BiBipIconButton
            buttonSize="small"
            onPress={() => {
              navigation.openDrawer();
            }}
          >
            <Ionicons name="menu" color="white" size={32} />
          </BiBipIconButton>
        </View>

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

export default CargoHome;
