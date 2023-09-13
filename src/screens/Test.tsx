import { FunctionComponent } from "react";
import { Text, View } from "react-native";
import TabView from "../components/views/TabView/TabView";

const Test: FunctionComponent = () => {
  return (
    <View className="h-full w-full items-center justify-center">
      <TabView
        indicatorColor="green"
        data={[
          {
            key: "1",
            label: "1",
            value: "First",
          },
          {
            key: "2",
            label: "2",
            value: "Second",
          },
        ]}
        renderItem={(item, index) => {
          return (
            <View
              key={item}
              className={`items-center justify-center h-full w-full bg-green-300`}
            >
              <Text>Hello</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Test;
