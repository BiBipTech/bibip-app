import { Dimensions, View } from "react-native";
import React, { FC, useEffect, useRef, useState } from "react";
import BiBipIconButton from "../../../components/buttons/BiBipIconButton/BiBipIconButton";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppDrawerCargoHomeStackCompositeProps } from "../../../../Router";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Spinner from "react-native-loading-spinner-overlay";
import { LatLng } from "react-native-maps";
import Landing from "../../Landing/Landing";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import BottomSheet from "@gorhom/bottom-sheet";
import CargoMap from "../../../components/views/Map/CargoMap/CargoMap";
import { useTailwindColor } from "../../../utils/hooks/useTailwindColor";
import { SharedElement } from "react-navigation-shared-element";
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

  const animatedQr = useAnimatedStyle(() => {
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

  const animatedPackage = useAnimatedStyle(() => {
    const value =
      (modalPosition.value - modalUpperBound) /
      (modalLowerBound - modalUpperBound);

    return {
      transform: [
        {
          translateX: -(1 - value) * 200,
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
        {/* <SharedElement
          className="flex flex-1 h-full w-full"
          style={{
            zIndex: -1,
          }}
          id="map"
        > */}
        <CargoMap
          onMapPress={() => {}}
          onMarkerSelect={() => {}}
          setLocation={setLocation}
        />
        {/* </SharedElement> */}
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
        <View style={animatedPackage} className="absolute left-8 bottom-24">
          {/* <SharedElement id="test"> */}
          <BiBipIconButton
            buttonSize="large"
            intent="primary"
            disabled={location === undefined}
            onPress={async () => {
              navigation.navigate("TrackPackage");
            }}
          >
            <Ionicons name="cube-outline" color="white" size={48} />
          </BiBipIconButton>
          {/* </SharedElement> */}
        </View>
        <View className="absolute right-8 bottom-24" style={animatedQr}>
          <BiBipIconButton
            buttonSize="large"
            intent="primary"
            disabled={location === undefined}
            onPress={async () => {
              navigation.navigate("NewPackage");
            }}
          >
            <FontAwesome5 name="plus" color="white" size={48} />
          </BiBipIconButton>
        </View>
      </View>
    </SafeAreaProvider>
  );
};

export default CargoHome;
