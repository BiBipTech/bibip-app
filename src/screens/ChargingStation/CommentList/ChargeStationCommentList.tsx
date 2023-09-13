import { FunctionComponent, useContext } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { AppDrawerChargeStationHomeStackCompositeProps } from "../../../../Router";
import { useQuery } from "react-query";
import UserContext from "../../../utils/context/UserContext";
import { awsGet } from "../../../utils/aws/api";
import StarRating from "react-native-star-rating-widget";

export type ChargeStationComment = {
  comment: string;
  rating: number;
  username: string;
  fullName: string;
  timestamp: number;
};
export type ChargeStationReport = {
  reportDesc: string;
  reportTitle: string;
  username: string;
  fullName: string;
  timestamp: number;
  stationId: number;
};

const ChargeStationCommentList: FunctionComponent<
  AppDrawerChargeStationHomeStackCompositeProps<"ChargeStationCommentList">
> = ({
  route: {
    params: { stationId },
  },
}) => {
  const { token, updateToken } = useContext(UserContext);

  const {
    data: comments,
    refetch: refetchComments,
    isFetching: isFetchingComments,
  } = useQuery(
    "getStationComments",
    async () => {
      await updateToken();

      const res = await awsGet(
        `https://8xoo4gmefh.execute-api.eu-central-1.amazonaws.com/dev/ratings?stationId=${stationId}`,
        token!
      );
      return res.data.items as ChargeStationComment[];
    },
    {
      enabled: !!token,
      onSuccess: (val) => {
        // console.log(val);
      },
      onError: (err) => {
        // console.log(JSON.stringify(err));
      },
      retry: false,
    }
  );

  if (isFetchingComments)
    return (
      <View className="items-center justify-center w-full h-full">
        <ActivityIndicator />
      </View>
    );

  return (
    <View className="p-4 w-full h-full">
      <FlatList
        showsVerticalScrollIndicator={false}
        data={comments}
        renderItem={({ item }) => (
          <View className="mb-2 p-4 w-full rounded-xl border border-gray-300 bg-white">
            <View className="flex flex-row justify-between items-center">
              <Text>{item.fullName}</Text>
              <StarRating
                rating={item.rating}
                starSize={20}
                enableHalfStar
                starStyle={{ marginHorizontal: 1 }}
                enableSwiping={false}
                onChange={() => {}}
                onRatingStart={() => {}}
                onRatingEnd={() => {}}
              />
            </View>
            <View className="border-b my-2 border-b-gray-200" />
            <Text className="text-justify text-lg">{item.comment}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default ChargeStationCommentList;
