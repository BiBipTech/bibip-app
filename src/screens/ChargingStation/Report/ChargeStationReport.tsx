import { FunctionComponent, useContext, useEffect, useState } from "react";
import {
  Dimensions,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import UserContext from "../../../utils/context/UserContext";
import { useQuery } from "react-query";
import { Auth } from "aws-amplify";
import { awsPost } from "../../../utils/aws/api";
import { AppDrawerChargeStationHomeStackCompositeProps } from "../../../../Router";
import Spinner from "react-native-loading-spinner-overlay";
import { useTailwindColor } from "../../../utils/hooks/useTailwindColor";

const ChargeStationReport: FunctionComponent<
  AppDrawerChargeStationHomeStackCompositeProps<"ChargeStationReport">
> = ({
  navigation: navigate,
  route: {
    params: { stationId },
  },
}) => {
  const [reportDesc, setReportDesc] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [activeDesc, setActiveDesc] = useState(false);
  const [activeHeader, setActiveHeader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const windowHeight = Dimensions.get("window").height;
  const keyboardLocation = useSharedValue(windowHeight);

  const user = useContext(UserContext);

  const buttonAnimated = useAnimatedStyle(() => {
    return {
      bottom: withTiming(windowHeight - keyboardLocation.value + 24),
    };
  }, []);

  const { refetch: sendComment } = useQuery(
    "sendComment",
    async () => {
      setIsLoading(true);

      const currentUser = await Auth.currentAuthenticatedUser();
      const fullName = currentUser.attributes.name;
      const username = currentUser.attributes.phone_number;

      if (!username || !user.token || !fullName) {
        throw new Error("Something went wrong");
      }
      await user.updateToken();
      const res = await awsPost(
        "https://8xoo4gmefh.execute-api.eu-central-1.amazonaws.com/dev/reports",
        {
          reportDesc,
          reportTitle,
          username: username,
          fullName: fullName,
          stationId: stationId,
        },
        user.token
      );
      return res;
    },
    {
      enabled: false,
      retry: false,
      onSuccess: (s) => {
        setIsLoading(false);
        Keyboard.dismiss();
        navigate.goBack();
      },
      onError: (e) => {
        setIsLoading(false);
        return alert("Bir hata oluştu. Lütfen tekrar deneyin.");
      },
    }
  );

  useEffect(() => {
    console.log(stationId);
  }, [stationId]);

  useEffect(() => {
    Keyboard.addListener("keyboardWillChangeFrame", (e) => {
      keyboardLocation.value = e.endCoordinates.screenY;
    });

    return () => {
      Keyboard.removeAllListeners("keyboardWillChangeFrame");
    };
  }, []);

  return (
    <View className="p-4 bg-white">
      <Spinner visible={isLoading} />
      <ScrollView className="w-full h-full bg-white rounded-2xl py-2 shadow-md px-4">
        <TextInput
          className={`w-full border ${
            activeHeader ? "border-blue-500" : "border-gray-200"
          } bg-white rounded-2xl p-4 text-gray-900 mb-4`}
          placeholderTextColor={useTailwindColor(
            activeHeader ? "bg-blue-500" : "bg-gray-400"
          )}
          onBlur={() => setActiveHeader(false)}
          onFocus={() => setActiveHeader(true)}
          value={reportTitle}
          onChangeText={(text) => setReportTitle(text)}
          placeholder="Rapor başlığını buraya yazın."
        />
        <TextInput
          className={`w-full border ${
            activeDesc ? "border-blue-500" : "border-gray-200"
          } h-64 bg-white rounded-2xl p-4 text-gray-900`}
          multiline
          placeholderTextColor={useTailwindColor(
            activeDesc ? "bg-blue-500" : "bg-gray-400"
          )}
          onBlur={() => setActiveDesc(false)}
          onFocus={() => setActiveDesc(true)}
          value={reportDesc}
          onChangeText={(text) => setReportDesc(text)}
          placeholder="Rapor açıklamasını buraya yazın."
        />
      </ScrollView>
      <Animated.View className="absolute w-full" style={buttonAnimated}>
        <TouchableOpacity
          className="w-full bg-bibip-green-500 left-4 rounded-xl py-3"
          onPress={() => {
            sendComment();
          }}
        >
          <Text className="text-center text-white rounded-md text-xl">
            Gönder
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default ChargeStationReport;
