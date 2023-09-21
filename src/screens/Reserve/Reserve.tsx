import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { AppDrawerBiBipHomeStackCompositeProps } from "../../../Router";
import { EventArg } from "@react-navigation/native";
import Mapbox from "@rnmapbox/maps";
import { useQuery } from "react-query";
import gql from "../../utils/gql/gql";
import { GetCarResult } from "../Trip/TripEnd/TripEnd.type";
import * as queries from "../../graphql/queries";
import { CameraRef } from "@rnmapbox/maps/lib/typescript/components/Camera";
import CarMarkerIcon from "../../../assets/marker-icon.svg";
import moment from "moment";

const Reserve: FunctionComponent<
  AppDrawerBiBipHomeStackCompositeProps<"Reserve">
> = ({
  navigation: { addListener, navigate, removeListener },
  route: {
    params: { carId, tripStarted },
  },
}) => {
  console.log("carId, tripStarted", carId, tripStarted);

  const [cameraRef, setCameraRef] = useState<CameraRef | null>(null);
  const [loc, setLoc] = useState<number[]>([]);
  const [userLocationRef, setUserLocationRef] =
    useState<Mapbox.UserLocation | null>(null);
  const [currentTimestamp, setCurrentTimestamp] = useState(+new Date());

  const mapRef = useRef<Mapbox.MapView>(null);
  const isLocationSet = useRef(false);

  // map related callback references
  const camera = useCallback((node: CameraRef) => {
    setCameraRef(node);
  }, []);
  const userLocation = useCallback((node: Mapbox.UserLocation) => {
    setUserLocationRef(node);
  }, []);

  const { data: reservedCar, isFetching: carLoading } = useQuery({
    queryKey: "getCar",
    queryFn: async () => {
      const res = await gql<GetCarResult>({
        query: queries.getCar,
        variables: {
          id: carId,
        },
      });
      console.log(res.data);

      return res.data?.getCar;
    },
  });

  useEffect(() => {
    const beforeRemove = (
      e: EventArg<
        "beforeRemove",
        true,
        {
          action: Readonly<{
            type: string;
            payload?: object | undefined;
            source?: string | undefined;
            target?: string | undefined;
          }>;
        }
      >
    ) => {
      e.preventDefault();
    };

    addListener("beforeRemove", beforeRemove);
    return () => {
      removeListener("beforeRemove", beforeRemove);
    };
  }, []);

  useEffect(() => {
    if (!cameraRef || !userLocationRef) return;
    if (!loc) return;

    cameraRef.setCamera({
      centerCoordinate: userLocationRef.state.coordinates ?? [29, 41],
      zoomLevel: 16,
      animationDuration: 1000,
    });
  }, [userLocationRef, cameraRef, loc]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimestamp(+new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <View className="flex flex-col h-full w-full">
      {reservedCar && (
        <Mapbox.MapView
          style={{
            width: "100%",
            height: "100%",
            zIndex: -1,
            position: "absolute",
          }}
          styleURL="mapbox://styles/eyub2001/clk2pmr3g00g301pf23265zbw"
        >
          {
            <Mapbox.PointAnnotation
              coordinate={[
                reservedCar.location?.lng ?? 0,
                reservedCar.location?.lat ?? 0,
              ]}
              id={reservedCar.id}
              key={reservedCar.id}
              onSelected={(p) => {
                cameraRef?.setCamera({
                  centerCoordinate: [
                    reservedCar.location?.lng ?? 0,
                    reservedCar.location?.lat ?? 0,
                  ],
                  zoomLevel: 16,
                  animationDuration: 500,
                });
              }}
            >
              <CarMarkerIcon width={75} height={75} />
            </Mapbox.PointAnnotation>
          }
          <Mapbox.UserLocation
            visible
            onUpdate={(location) => {
              if (isLocationSet.current) return;
              isLocationSet.current = true;
              setLoc([location.coords.longitude, location.coords.latitude]);
            }}
            ref={userLocation}
          />
          <Mapbox.Camera ref={camera} />
        </Mapbox.MapView>
      )}
      <View className="w-full flex flex-col bg-gray-800 h-32">
        <Text className="px-4 pt-4 flex-1 text-2xl text-bibip-blue-300 text-center font-semibold">
          Rezervasyon başladı!
        </Text>
        <View className="flex flex-row flex-1 border-t border-t-white">
          <View className="flex-1 items-center justify-center flex border-r border-r-white">
            <Text className="text-white text-lg">
              {moment(Math.floor(currentTimestamp - tripStarted)).format(
                "mm:ss"
              )}
            </Text>
          </View>
          <View className="flex-1 items-center justify-center flex flex-row">
            <Text className="text-white text-lg">
              {(
                Math.floor((currentTimestamp - tripStarted) / 60000) * 0.99
              ).toFixed(2)}
              ₺
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          columnGap: 8,
        }}
        className="flex flex-row absolute bottom-16 px-8 items-center justify-center"
      >
        <TouchableOpacity className="border border-bibip-red-500 rounded-xl py-2 bg-white flex-1 items-center justify-center">
          <Text className="text-xl font-semibold text-bibip-red-500">
            İptal Et
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="border border-bibip-green-500 rounded-xl py-2 bg-bibip-green-500 flex-1 items-center justify-center"
          onPress={() => {
            navigate("QRModal", {
              location: {
                longitude: loc[0],
                latitude: loc[1],
              },
              carId,
            });
          }}
        >
          <Text className="text-xl font-semibold text-white">Sürüş Başlat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Reserve;
