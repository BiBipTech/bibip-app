import {
  FunctionComponent,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import Animated from "react-native-reanimated";
import useCustomTailwind from "../../utils/hooks/useCustomTailwind";
import HillShapeUp from "../../../assets/hill-shape-up.svg";
import Handle from "../../components/views/AnimatedIndicator/AnimatedIndicator";
import HomeButton from "../../../assets/home-logo.svg";
import CargoButton from "../../../assets/kargo_logo.svg";
import ChargeStationButton from "../../../assets/charge_station_logo.svg";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

interface LandingProps {
  handle?: (index: number) => void;
  modalPosition: Animated.SharedValue<number>;
  navigate: (screen: string) => void;
  bottomSheetRef: RefObject<BottomSheetMethods>;
  hideInfoBox?: () => void;
}

const Landing: FunctionComponent<LandingProps> = ({
  handle,
  modalPosition,
  navigate,
  hideInfoBox,
  bottomSheetRef,
}) => {
  // variables
  const snapPoints = useMemo(() => ["4%", "40%", "79%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index > 0 && hideInfoBox) hideInfoBox();
    if (handle) handle(index);
  }, []);

  const width = Dimensions.get("window").width;

  // renders
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      style={[
        {
          zIndex: 3,
        },
        useCustomTailwind("bg-transparent rounded-3xl"),
      ]}
      backgroundStyle={useCustomTailwind("rounded-3xl border border-white")}
      animatedPosition={modalPosition}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      handleComponent={({ animatedIndex, animatedPosition }, context) => {
        return (
          <View
            className="items-center justify-end flex flex-1 w-full h-24 absolute -top-11"
            onTouchEnd={() => {
              if (hideInfoBox) hideInfoBox();
              if (animatedIndex.value === 2) bottomSheetRef.current?.collapse();
              else bottomSheetRef.current?.snapToIndex(animatedIndex.value + 1);
            }}
          >
            <HillShapeUp width={150} height={150} />
            <Handle
              style={useCustomTailwind("absolute bottom-14")}
              animatedIndex={animatedIndex}
              animatedPosition={animatedPosition}
            />
          </View>
        );
      }}
    >
      <View className=" p-4 flex flex-col justify-start">
        <View>
          <TouchableOpacity
            onPress={() => {
              bottomSheetRef.current?.collapse();
              navigate("BiBipStack");
            }}
          >
            <HomeButton width={"auto"} height={150} />
          </TouchableOpacity>
        </View>

        <View className="flex flex-row justify-between items-start">
          <View>
            <TouchableOpacity
              onPress={() => {
                bottomSheetRef.current?.collapse();
                navigate("ChargeStationStack");
              }}
            >
              <ChargeStationButton
                width={(width - 32) / 2 - 2}
                height={109.57}
              />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                bottomSheetRef.current?.collapse();
                navigate("CargoStack");
              }}
            >
              <CargoButton width={(width - 32) / 2 - 2} height={109.57} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
};

export default Landing;
