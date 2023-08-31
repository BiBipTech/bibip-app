import { Dimensions, Text, View } from "react-native";
import React, {
  FC,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import BiBipIconButton from "../../../components/buttons/BiBipIconButton/BiBipIconButton";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppDrawerChargeStationHomeStackCompositeProps } from "../../../../Router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Spinner from "react-native-loading-spinner-overlay";
import { useQuery } from "react-query";
import { LatLng } from "react-native-maps";
import Landing from "../../Landing/Landing";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import BottomSheet from "@gorhom/bottom-sheet";
import ChargeStationInformationBox, {
  ChargeStation,
} from "../../../components/views/InformationBox/ChargeStationInformationBox/ChargeStationInformationBox";
import ChargeStationMap from "../../../components/views/Map/ChargeStationMap/ChargeStationMap";
import { awsGet, promiseWithLoader } from "../../../utils/aws/api";
import { getDirections } from "../../../utils/api/mapbox";
import UserContext from "../../../utils/context/UserContext";

const ChargeStationHome: FC<
  AppDrawerChargeStationHomeStackCompositeProps<"ChargeStationHome">
> = ({ route, navigation }) => {
  const { token, updateToken } = useContext(UserContext);

  const [location, setLocation] = useState<LatLng>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStation, setSelectedStation] = useState<ChargeStation | null>(
    null
  );

  const bottomSheetRef = useRef<BottomSheet>(null);

  const modalPosition = useSharedValue(0);
  const infoBoxShown = useSharedValue(0);
  const commentListShown = useSharedValue(false);

  useEffect(() => {
    console.log("ChargeStationHome.tsx: useEffect: images: ", Math.random());
  });

  const { data: commentCount, refetch: refetchCommentCount } = useQuery(
    "getStationCommentCount",
    async () => {
      await updateToken();

      const requestUrl = `https://8xoo4gmefh.execute-api.eu-central-1.amazonaws.com/dev/ratings/count?stationId=${selectedStation?.id}`;

      const res = await awsGet(requestUrl, token!);

      return res.data as {
        count: number;
        averageRating: number | null;
      };
    },
    {
      enabled: false,
      cacheTime: 0,
      onError: (err) => {
        console.log(JSON.stringify(err));
      },
      retry: false,
      refetchOnMount: !!selectedStation,
      refetchOnWindowFocus: !!selectedStation,
    }
  );

  const { top } = useSafeAreaInsets();

  const infoBoxAnimation = useAnimatedStyle(() => {
    return {
      top: withTiming(infoBoxShown.value === 1 ? top : -300),
      opacity: withTiming(infoBoxShown.value),
      paddingHorizontal: withTiming(commentListShown.value ? 0 : 16),
    };
  }, [infoBoxShown, commentListShown]);

  useEffect(() => {
    if (commentCount && selectedStation)
      setSelectedStation({
        ...selectedStation,
        commentCount: commentCount.count,
        averageRating: commentCount.averageRating ?? 5.0,
      });
  }, [commentCount]);

  useEffect(() => {
    if (selectedStation) refetchCommentCount();
  }, [selectedStation]);

  return (
    <SafeAreaProvider>
      <View className="items-center justify-center h-full w-full flex-1">
        <Spinner visible={isLoading} />
        <Landing
          hideInfoBox={useMemo(
            () => () => {
              infoBoxShown.value = 0;
              commentListShown.value = false;
            },
            []
          )}
          navigate={(s: any) => {
            navigation.navigate(s);
          }}
          modalPosition={modalPosition}
          bottomSheetRef={bottomSheetRef}
        />
        <ChargeStationMap
          setLocation={(s) => {
            setLocation(s);
          }}
          onMarkerSelect={async (cs) => {
            const res = await promiseWithLoader(
              setIsLoading,
              getDirections(
                `${location?.longitude}%2C${location?.latitude}`,
                `${cs.coords.longitude}%2C${cs.coords.latitude}`
              )
            );
            const { distance, duration } = res.routes[0];

            setSelectedStation({
              name: cs.name,
              distance: (distance / 1000).toFixed(1),
              duration: (duration / 60).toFixed(1),
              latitude: cs.coords.latitude,
              longitude: cs.coords.longitude,
              address: `${cs.address.split(", ")[0]}, ${
                cs.address.split(", ")[1]
              }`,
              id: cs.id,
              commentCount: commentCount?.count,
              averageRating: commentCount?.averageRating ?? 5.0,
            });
            bottomSheetRef.current?.collapse();
            infoBoxShown.value = 1;
            // setInfoBoxShown(1);
            return res.routes[0].geometry.coordinates;
          }}
          onMapPress={useMemo(
            () => () => {
              bottomSheetRef.current?.collapse();
              infoBoxShown.value = 0;
              commentListShown.value = false;
            },
            []
          )}
        />
        <Animated.View
          className={"absolute top-10 w-full"}
          style={infoBoxAnimation}
        >
          <ChargeStationInformationBox
            selectedStation={selectedStation}
            onComment={() => {
              navigation.navigate("ChargeStationComment", {
                stationId: selectedStation?.id ?? 0,
              });
            }}
            onReport={() => {
              navigation.navigate("ChargeStationReport", {
                stationId: selectedStation?.id ?? 0,
              });
            }}
            onSeeCommentList={() => {
              // navigation.navigate("ChargeStationCommentList", {
              //   stationId: selectedStation?.id ?? 0,
              // });
              commentListShown.value = !commentListShown.value;
            }}
            commentListShown={commentListShown}
          />
        </Animated.View>
        <Animated.View
          className={`absolute left-7 top-16`}
          style={useAnimatedStyle(() => {
            return {
              transform: [
                {
                  translateY: withTiming(infoBoxShown.value === 0 ? 0 : 280),
                },
              ],
              zIndex: -1,
            };
          }, [])}
        >
          <BiBipIconButton
            buttonSize="small"
            onPress={() => {
              navigation.openDrawer();
            }}
          >
            <Ionicons name="menu" color="white" size={32} />
          </BiBipIconButton>
        </Animated.View>

        <View
          className="absolute right-8 bottom-24"
          style={{
            zIndex: -1,
          }}
        >
          <BiBipIconButton
            buttonSize="large"
            intent="primary"
            disabled={location === undefined}
            onPress={async () => {}}
          >
            <Ionicons name="qr-code-outline" color="white" size={48} />
          </BiBipIconButton>
        </View>
      </View>
    </SafeAreaProvider>
  );
};

export default ChargeStationHome;
