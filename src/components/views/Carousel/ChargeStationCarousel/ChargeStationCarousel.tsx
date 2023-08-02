import * as React from "react";
import { Dimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import type { ICarouselInstance } from "react-native-reanimated-carousel";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import ChargeStationInformationBox from "../../InformationBox/ChargeStationInformationBox/ChargeStationInformationBox";

const PAGE_WIDTH = Dimensions.get("window").width;

const ChargeStationCarousel: React.FunctionComponent = () => {
  const [data, setData] = React.useState([...new Array(4).keys()]);
  const [isVertical, setIsVertical] = React.useState(false);
  const [isFast, setIsFast] = React.useState(false);
  const [isAutoPlay, setIsAutoPlay] = React.useState(false);
  const [isPagingEnabled, setIsPagingEnabled] = React.useState(true);
  const ref = React.useRef<ICarouselInstance>(null);

  return (
    <View className="bg-green-500 w-full">
      <Carousel
        loop
        width={PAGE_WIDTH / 1.2}
        height={200}
        ref={ref}
        testID={"xxx"}
        autoPlay={isAutoPlay}
        autoPlayInterval={isFast ? 100 : 2000}
        data={data}
        pagingEnabled={isPagingEnabled}
        onSnapToItem={(index) => console.log("current index:", index)}
        renderItem={({ index }) => (
          <ChargeStationInformationBox
            key={index}
            selectedStation={{
              name: "test",
              distance: "test",
              duration: "test",
              address: "test",
              latitude: 0,
              longitude: 0,
            }}
          />
        )}
      />
    </View>
  );
};

export default ChargeStationCarousel;
