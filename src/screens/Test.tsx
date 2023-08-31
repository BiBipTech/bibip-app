import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Mapbox from "@rnmapbox/maps";

interface TestProps {}

const Test: FunctionComponent<TestProps> = () => {
  const [count, setCount] = useState(5);
  const [renderCount, setRenderCount] = useState(0);

  const doubleCount = useMemo(() => {
    const timestamp = +new Date() + 5000;

    while (timestamp > +new Date()) {}

    return count * 2;
  }, [count]);

  useEffect(() => {
    console.log(doubleCount);
  }, [doubleCount, renderCount]);

  return (
    <View className="justify-center items-center h-full w-full">
      <Text className="text-xl">{renderCount}</Text>
      <TouchableOpacity
        className="bg-cyan-500 px-8 py-4 rounded-md mt-8"
        onPress={() => {
          setRenderCount((prevRenderCount) => prevRenderCount + 1);
        }}
      >
        <Text className="text-white text-xl">Hello</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-cyan-500 px-8 py-4 rounded-md mt-8"
        onPress={() => {
          setCount((prevCount) => prevCount + 1);
        }}
      >
        <Text className="text-white text-xl">Hello</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Test;
