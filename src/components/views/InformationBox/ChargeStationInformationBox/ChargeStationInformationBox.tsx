import {
  FunctionComponent,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import NavigationButton from "../../../buttons/NavigationButton/NavigationButton";
import StarRating from "react-native-star-rating-widget";
import InformationBoxButton from "../../../buttons/InformationBoxButton/InformationBoxButton";
import IconWithLabel from "../../../buttons/IconWithLabel";
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useQuery } from "react-query";
import { awsGet } from "../../../../utils/aws/api";
import { ChargeStationComment } from "../../../../screens/ChargingStation/CommentList/ChargeStationCommentList";
import UserContext from "../../../../utils/context/UserContext";
import moment from "moment";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ChargeStation = {
  name: string;
  distance: string;
  duration: string;
  latitude: number;
  longitude: number;
  address: string;
  id: number;
  commentCount?: number;
  averageRating?: number;
} | null;

interface ChargeStationInformationBoxProps {
  selectedStation: ChargeStation;
  onComment: () => void;
  onReport: () => void;
  onSeeCommentList: () => void;
  commentListShown: SharedValue<boolean>;
}

const ChargeStationInformationBox: FunctionComponent<
  ChargeStationInformationBoxProps
> = ({
  selectedStation,
  onComment,
  onReport,
  onSeeCommentList,
  commentListShown,
}) => {
  const [commentListShownState, setCommentListShownState] = useState(false);

  const { token, updateToken } = useContext(UserContext);

  const { bottom } = useSafeAreaInsets();

  const {
    data: comments,
    refetch: refetchComments,
    isFetching: isFetchingComments,
  } = useQuery(
    "getStationComments",
    async () => {
      await updateToken();

      const res = await awsGet(
        `https://8xoo4gmefh.execute-api.eu-central-1.amazonaws.com/dev/ratings?stationId=${
          selectedStation?.id ?? 0
        }`,
        token!
      );
      return res.data.items as ChargeStationComment[];
    },
    {
      enabled: !!token && !!commentListShownState,
      onSuccess: (val) => {
        // console.log(val);
      },
      onError: (err) => {
        // console.log(JSON.stringify(err));
      },
      retry: false,
    }
  );
  const height = Dimensions.get("window").height;
  const boxAnimation = useAnimatedStyle(() => {
    runOnJS(setCommentListShownState)(commentListShown.value);

    return {
      height: withTiming(commentListShown.value ? height : height / 3),
      marginBottom: 16,
    };
  }, [commentListShown]);

  return (
    <Animated.View style={boxAnimation}>
      <View
        className={`${commentListShownState ? "h-full" : "h-72"}
      w-full bg-gray-900 rounded-2xl
      shadow-md py-4 px-4 flex flex-col`}
        style={{
          rowGap: 12,
        }}
      >
        <View
          className="flex flex-col"
          onTouchEnd={() => {
            onSeeCommentList();
          }}
        >
          <View className="mb-3 flex flex-row justify-between">
            <View className="flex flex-col flex-initial w-4/5 justify-between items-start">
              <Text className="text-gray-100 text-start font-bold text-lg">
                {selectedStation?.name}
              </Text>
              <Text className="text-gray-100 text-start break-all">
                {selectedStation?.address}
              </Text>
            </View>
            <NavigationButton />
          </View>
          <View className="mb-3 flex flex-row justify-start items-baseline divide-x-4 divide-transparent">
            <Text className="text-gray-100 text-end">
              {selectedStation?.averageRating?.toFixed(1) ?? 5.0}
            </Text>
            <StarRating
              onChange={(rating) => console.log(rating)}
              rating={selectedStation?.averageRating ?? 5}
              starSize={17}
              color="gold"
              onRatingStart={() => console.log()}
              starStyle={{ marginHorizontal: 1 }}
              StarIconComponent={({ type, size, color }) => {
                if (type === "empty")
                  return (
                    <FontAwesome name="star-o" size={size} color={color} />
                  );
                else if (type === "half")
                  return (
                    <FontAwesome name="star-half-o" size={size} color={color} />
                  );

                return <FontAwesome name="star" size={size} color={color} />;
              }}
            />
            <Text className="text-gray-100 text-end">
              ({selectedStation?.commentCount ?? "..."} reviews)
            </Text>
          </View>

          <View className="mb-3 flex flex-row justify-start divide-x-4 divide-transparent">
            <View className="bg-bibip-red-400 px-2 py-1 rounded-md">
              <Text className="text-gray-100 text-xs">In Use</Text>
            </View>
            <IconWithLabel
              icon={
                <Ionicons size={16} name="location-sharp" color={"white"} />
              }
              label={`${selectedStation?.distance} km`}
            />
            <IconWithLabel
              icon={
                <MaterialCommunityIcons size={16} name="taxi" color={"white"} />
              }
              label={`${selectedStation?.duration} dk.`}
            />
          </View>

          <View className="mb-3 border-y border-gray-500 py-4 flex-row flex justify-start">
            <Text className="text-gray-100">Chargers</Text>
          </View>
          <View
            className="flex flex-row w-full justify-between"
            onTouchEnd={(e) => {
              e.stopPropagation();
            }}
          >
            <InformationBoxButton
              invert
              danger
              text="Raporla"
              onPress={(e) => {
                e.stopPropagation();
                onReport();
              }}
            />
            <View className="w-2" />
            <InformationBoxButton
              text="Puanla"
              onPress={(e) => {
                e.stopPropagation();
                onComment();
              }}
            />
          </View>
        </View>
        {commentListShownState && !comments && (
          <View className="h-64 items-center justify-center">
            <ActivityIndicator />
          </View>
        )}
        {commentListShownState && comments && (
          <FlatList
            className="mb-12"
            style={{
              marginBottom: bottom,
              paddingBottom: bottom,
            }}
            data={comments}
            ItemSeparatorComponent={() => (
              <View className="w-full border-b border-gray-700 mb-2" />
            )}
            renderItem={({
              item: { comment, fullName, rating, timestamp, username },
            }) => (
              <View className="mb-2 p-4 w-full" key={timestamp}>
                <View className="flex flex-col justify-between items-start">
                  <View className="flex flex-row justify-around">
                    <View className="flex flex-col">
                      <Text className="text-gray-100 text-lg font-semibold">
                        {fullName}
                      </Text>
                      <View className="flex flex-row items-center">
                        <StarRating
                          rating={rating}
                          starSize={20}
                          enableHalfStar
                          starStyle={{ marginHorizontal: 1 }}
                          enableSwiping={false}
                          onChange={() => {}}
                        />
                        <Text className="text-gray-100 ml-1">{`(${rating})`}</Text>
                      </View>
                    </View>
                    <View className="flex-1" />
                    <View className="flex flex-col items-end justify-around">
                      <Text className="text-gray-100">
                        {moment(timestamp * 1000).fromNow()}
                      </Text>
                      <Text className="text-gray-100">
                        {moment(timestamp * 1000).format("h:mm")}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text className="text-justify text-lg text-gray-100 mt-4">
                  {comment}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </Animated.View>
  );
};

export default ChargeStationInformationBox;
