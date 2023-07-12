import { FunctionComponent, useCallback, useMemo, useRef } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import Animated from "react-native-reanimated";
import useCustomTailwind from "../../utils/hooks/useCustomTailwind";
import HillShapeUp from "../../../assets/hill-shape-up.svg";
import Handle from "../../components/views/AnimatedIndicator/AnimatedIndicator";
import HomeButton from "../../../assets/home-logo.svg";
import CargoButton from "../../../assets/kargo_logo.svg";
import MarketButton from "../../../assets/market_logo.svg";

interface LandingProps {
  handle: (index: number) => void;
  modalPosition: Animated.SharedValue<number>;
}

const Landing: FunctionComponent<LandingProps> = ({
  handle,
  modalPosition,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ["4%", "40%", "79%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    handle(index);
  }, []);

  const width = Dimensions.get("window").width;

  // renders
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      style={[
        {
          zIndex: 3,
        },
        useCustomTailwind("bg-transparent rounded-3xl shadow-2xl"),
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
        <View className="shadow-md shadow-black/30">
          <TouchableOpacity
            onPress={() => {
              bottomSheetRef.current?.collapse();
            }}
          >
            <HomeButton width={"auto"} height={150} />
          </TouchableOpacity>
        </View>

        <View className="flex flex-row justify-between items-start">
          <View className="shadow-md shadow-black/30">
            <MarketButton
              width={(width - 32) / 2 - 2}
              height={109.57}
              opacity={0.3}
            />
          </View>
          <View className="shadow-md shadow-black/30">
            <CargoButton
              opacity={0.3}
              width={(width - 32) / 2 - 2}
              height={109.57}
            />
          </View>
        </View>
      </View>
    </BottomSheet>
  );
};

export default Landing;
