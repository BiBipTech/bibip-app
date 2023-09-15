import {
  FunctionComponent,
  memo,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Text,
  View,
  Animated as AnimatedView,
} from "react-native";
import {
  FontAwesome,
  Ionicons,
  Entypo,
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
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useQuery } from "react-query";
import { awsGet } from "../../../../utils/aws/api";
import {
  ChargeStationComment,
  ChargeStationReport,
} from "../../../../screens/ChargingStation/CommentList/ChargeStationCommentList";
import UserContext from "../../../../utils/context/UserContext";
import moment from "moment";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTailwindColor } from "../../../../utils/hooks/useTailwindColor";
import TabView from "../../TabView/TabView";

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

  const [sortBy, setSortBy] = useState<"rating" | "date">("rating");
  const [order, setOrder] = useState<"descending" | "ascending">("descending");

  const [index, setIndex] = useState(0);
  const routes = [
    { key: "comments", title: "Yorumlar" },
    { key: "reports", title: "Raporlar" },
  ];

  const [dropdownEnabled, setDropdownEnabled] = useState(false);
  const dropdownOpacity = useSharedValue(0);

  const { token, updateToken } = useContext(UserContext);

  const getCommentSorter = () => {
    switch (sortBy) {
      case "date":
        return (a: ChargeStationComment, b: ChargeStationComment) => {
          if (order === "ascending") return a.timestamp - b.timestamp;
          else return b.timestamp - a.timestamp;
        };
      case "rating":
        return (a: ChargeStationComment, b: ChargeStationComment) => {
          if (order === "ascending") return a.rating - b.rating;
          else return b.rating - a.rating;
        };
      default:
        return (a: ChargeStationComment, b: ChargeStationComment) => {
          return a.timestamp - b.timestamp;
        };
    }
  };
  const getReportSorter = () => {
    switch (sortBy) {
      case "date":
        return (a: ChargeStationReport, b: ChargeStationReport) => {
          if (order === "ascending") return a.timestamp - b.timestamp;
          else return b.timestamp - a.timestamp;
        };
      default:
        return (a: ChargeStationReport, b: ChargeStationReport) => {
          return a.timestamp - b.timestamp;
        };
    }
  };

  const {
    data: reports,
    refetch: refetchReports,
    isFetching: isFetchingReports,
  } = useQuery(
    "getStationReports",
    async () => {
      await updateToken();

      const res = await awsGet(
        `https://8xoo4gmefh.execute-api.eu-central-1.amazonaws.com/dev/reports/${
          selectedStation?.id ?? 0
        }`,
        token!
      );
      return res.data.items as ChargeStationReport[];
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

  const boxAnimation = useAnimatedStyle(() => {
    runOnJS(setCommentListShownState)(commentListShown.value);

    return {
      marginBottom: 16,
    };
  }, [commentListShown]);

  const iconColor = useTailwindColor("bg-green-500");

  const dropdownStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(dropdownOpacity.value, {
        duration: 250,
      }),
    };
  }, [dropdownOpacity]);

  const CommentList = memo(() => (
    <View className="h-[60vh] px-4">
      {commentListShownState && (
        <InformationBoxButton
          text="Yorum Yap"
          className="mt-4 flex-none"
          onPress={() => {
            onComment();
          }}
        />
      )}
      {commentListShownState && (
        <View
          style={{
            zIndex: 3,
          }}
          className="flex flex-row justify-between mb-2 mt-3 items-end"
        >
          <Text className="text-gray-100 text-2xl font-semibold">Sırala</Text>
          <View
            className="flex flex-row items-center"
            style={{
              columnGap: 4,
            }}
          >
            <View
              className="flex flex-col"
              style={{ zIndex: 3 }}
              onTouchStart={(e) => {
                e.stopPropagation();
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setDropdownEnabled((e) => {
                    if (!e) {
                      dropdownOpacity.value = 1;
                    } else {
                      dropdownOpacity.value = 0;
                    }

                    return !e;
                  });
                }}
              >
                <Text className="text-green-500 text-lg px-2">
                  {sortBy === "date" ? "Tarih" : "Puan"}
                </Text>
              </TouchableOpacity>
              {dropdownEnabled && (
                <Animated.View
                  className="w-full absolute flex items-center justify-center top-6 bg-gray-800 py-1"
                  style={[{ rowGap: 2 }, dropdownStyle]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setSortBy("rating");
                      setDropdownEnabled(false);
                    }}
                  >
                    <Text className="text-gray-100 text-center text-lg">
                      Puan
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setSortBy("date");
                      setDropdownEnabled(false);
                    }}
                  >
                    <Text className="text-gray-100 text-center text-lg">
                      Tarih
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
            <TouchableOpacity
              className="flex flex-col"
              onPress={() => {
                setOrder((e) => {
                  if (e === "ascending") return "descending";
                  else return "ascending";
                });
              }}
            >
              <MaterialCommunityIcons
                name={order === "ascending" ? "arrow-up" : "arrow-down"}
                color={iconColor}
                size={21}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {commentListShownState && !comments && (
        <View className="h-64 items-center justify-center">
          <ActivityIndicator />
        </View>
      )}
      {commentListShownState && comments && (
        <Animated.FlatList
          className="h-1/2"
          data={comments.sort(getCommentSorter())}
          keyExtractor={({ timestamp }) => timestamp.toString()}
          ListEmptyComponent={() => (
            <View className="h-64 items-center justify-center">
              <Text className="text-gray-100 text-lg">
                Bu şarj istasyonu için hiç yorum yapılmamış.
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View className="w-full border-b border-gray-700 mb-2" />
          )}
          renderItem={({
            item: { comment, fullName, rating, timestamp, username },
          }) => (
            <View className="mb-2 py-2 w-full" key={timestamp}>
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
  ));
  const ReportList = memo(() => (
    <View className="h-[60vh] px-4">
      {commentListShownState && (
        <InformationBoxButton
          text="Şikayet Et"
          className="mt-4 flex-none"
          invert
          danger
          onPress={() => {
            onReport();
          }}
        />
      )}
      {commentListShownState && (
        <View
          style={{
            zIndex: 3,
          }}
          className="flex flex-row justify-between mb-2 mt-3 items-end"
        >
          <Text className="text-gray-100 text-2xl font-semibold">Sırala</Text>
          <View
            className="flex flex-row items-center"
            style={{
              columnGap: 4,
            }}
          >
            <View
              className="flex flex-col"
              style={{ zIndex: 3 }}
              onTouchStart={(e) => {
                e.stopPropagation();
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setDropdownEnabled((e) => {
                    if (!e) {
                      dropdownOpacity.value = 1;
                    } else {
                      dropdownOpacity.value = 0;
                    }

                    return !e;
                  });
                }}
              >
                <Text className="text-green-500 text-lg px-2">
                  {sortBy === "date" ? "Tarih" : "Puan"}
                </Text>
              </TouchableOpacity>
              {dropdownEnabled && (
                <Animated.View
                  className="w-full absolute flex items-center justify-center top-6 bg-gray-800 py-1"
                  style={[{ rowGap: 2 }, dropdownStyle]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setSortBy("rating");
                      setDropdownEnabled(false);
                    }}
                  >
                    <Text className="text-gray-100 text-center text-lg">
                      Puan
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setSortBy("date");
                      setDropdownEnabled(false);
                    }}
                  >
                    <Text className="text-gray-100 text-center text-lg">
                      Tarih
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
            <TouchableOpacity
              className="flex flex-col"
              onPress={() => {
                setOrder((e) => {
                  if (e === "ascending") return "descending";
                  else return "ascending";
                });
              }}
            >
              <MaterialCommunityIcons
                name={order === "ascending" ? "arrow-up" : "arrow-down"}
                color={iconColor}
                size={21}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {commentListShownState && !reports && (
        <View className="h-64 items-center justify-center">
          <ActivityIndicator />
        </View>
      )}
      {commentListShownState && reports && (
        <Animated.FlatList
          className="h-1/2"
          data={reports.sort(getReportSorter())}
          keyExtractor={({ timestamp }) => timestamp.toString()}
          ListEmptyComponent={() => (
            <View className="h-64 items-center justify-center">
              <Text className="text-gray-100 text-lg">
                Bu şarj istasyonu için hiç yorum yapılmamış.
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View className="w-full border-b border-gray-700 mb-2" />
          )}
          renderItem={({
            item: { reportDesc, fullName, reportTitle, timestamp, username },
          }) => (
            <View className="mb-2 py-2 w-full" key={timestamp}>
              <View className="flex flex-col justify-between items-start">
                <View className="flex flex-row justify-around">
                  <View className="flex flex-col">
                    <Text className="text-gray-100 text-xl font-semibold">
                      {reportTitle}
                    </Text>
                    <Text className="text-gray-100 text-base font-semibold">
                      {fullName}
                    </Text>
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
                {reportDesc}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  ));

  const CommentTab = () => {
    return (
      <TabView
        indicatorColor={useTailwindColor("bg-gray-500")}
        data={[
          {
            key: "1",
            label: "Yorumlar",
            value: "comments",
          },
          {
            key: "2",
            label: "Raporlar",
            value: "reports",
          },
        ]}
        renderItem={(item, index) => {
          if (item === "comments") return <CommentList key={item} />;
          else return <ReportList key={item} />;
        }}
      />
    );
  };

  return (
    <Animated.View
      style={boxAnimation}
      onTouchStart={(e) => {
        e.stopPropagation();
        setDropdownEnabled(false);
        dropdownOpacity.value = 0;
      }}
    >
      <Animated.View
        className={`${commentListShownState ? "h-screen" : ""}
          w-full bg-gray-900 rounded-2xl
          shadow-md py-4`}
        style={[boxAnimation]}
        onTouchEnd={() => {}}
      >
        <View
          className="px-4"
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
            <View className="flex flex-col items-center">
              <NavigationButton />
            </View>
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
              ({selectedStation?.commentCount ?? "..."} yorum)
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
          <View
            className="flex flex-row w-full justify-between"
            onTouchEnd={(e) => {
              e.stopPropagation();
            }}
          >
            <InformationBoxButton
              text="Detaylar"
              onPress={() => {
                onSeeCommentList();
              }}
            />
          </View>
        </View>
        {commentListShownState && (
          <View className="w-full h-full mt-2 ">
            <CommentTab />
          </View>
        )}
      </Animated.View>
    </Animated.View>
  );
};

export default ChargeStationInformationBox;
