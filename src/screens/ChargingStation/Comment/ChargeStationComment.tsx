import { FunctionComponent, useContext, useEffect, useState } from "react";
import {
  Dimensions,
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppDrawerChargeStationHomeStackCompositeProps } from "../../../../Router";
import StarRating from "react-native-star-rating-widget";
import { TextInput } from "react-native-gesture-handler";
import { useTailwindColor } from "../../../utils/hooks/useTailwindColor";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useQuery } from "react-query";
import { awsPost, promiseWithLoader } from "../../../utils/aws/api";
import UserContext from "../../../utils/context/UserContext";
import { Auth } from "aws-amplify";
import Spinner from "react-native-loading-spinner-overlay";

interface ChargeStationCommentProps {}

const ChargeStationComment: FunctionComponent<
  AppDrawerChargeStationHomeStackCompositeProps<"ChargeStationComment">
> = ({
  navigation: navigate,
  route: {
    params: { stationId },
  },
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [activeStyle, setActiveStyle] = useState(false);
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
        "https://8xoo4gmefh.execute-api.eu-central-1.amazonaws.com/dev/ratings",
        {
          rating: rating,
          comment: comment,
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
        <StarRating
          rating={rating}
          onChange={(rating) => {
            setRating(rating);
          }}
          style={{ alignSelf: "center", marginBottom: 8 }}
        />
        <TextInput
          className={`w-full border ${
            activeStyle ? "border-blue-500" : "border-gray-200"
          } h-64 bg-white rounded-2xl p-4 text-gray-900 mt-4`}
          multiline
          placeholderTextColor={useTailwindColor(
            activeStyle ? "bg-blue-500" : "bg-gray-400"
          )}
          onBlur={() => setActiveStyle(false)}
          onFocus={() => setActiveStyle(true)}
          value={comment}
          onChangeText={(text) => setComment(text)}
          placeholder="Yorumunuzu buraya yazın."
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

export default ChargeStationComment;
