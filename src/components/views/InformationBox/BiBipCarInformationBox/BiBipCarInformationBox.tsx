import { FunctionComponent, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Car } from "../../../../models";
import IconWithLabel from "../../../buttons/IconWithLabel";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import InformationBoxButton from "../../../buttons/InformationBoxButton/InformationBoxButton";
import { useQuery } from "react-query";
import { getWalkingDirections } from "../../../../utils/api/mapbox";
import * as Location from "expo-location";
import Spinner from "react-native-loading-spinner-overlay";
import { useTailwindColor } from "../../../../utils/hooks/useTailwindColor";

interface BiBipCarInformationBoxProps {
  selectedCar: Car;
  onScanQr: () => void;
  onReserve: () => void;
}

const BiBipCarInformationBox: FunctionComponent<
  BiBipCarInformationBoxProps
> = ({
  selectedCar: {
    id,
    name,
    Trips: trips,
    battery,
    createdAt,
    inUse,
    location,
    updatedAt,
  },
  onScanQr,
  onReserve,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: directions,
    refetch: refetchDirections,
    isFetching: directionsFetching,
  } = useQuery({
    queryKey: "getCar",
    queryFn: async () => {
      setIsLoading(true);

      const currentLocation = await Location.getCurrentPositionAsync();

      const directions = await getWalkingDirections(
        `${currentLocation.coords.longitude}%2C${currentLocation.coords.latitude}`,
        `${location?.lng}%2C${location?.lat}`
      );
      return directions;
    },
    onSuccess: (data) => {
      setIsLoading(false);
    },
    onError: (e) => {
      console.error(JSON.stringify(e));
      setIsLoading(false);
    },
  });

  useEffect(() => {
    refetchDirections();
  }, [id]);

  const iconColor = useTailwindColor("bg-gray-400");

  return (
    <View className="w-full bg-gray-900 rounded-2xl shadow-md h-48 pb-4 pt-2 px-4 flex flex-col justify-end">
      <Spinner visible={isLoading} />
      <View className="flex flex-col justify-around flex-1 divide-x-4 divide-transparent mb-4">
        <IconWithLabel
          icon={<Ionicons size={24} name="location-sharp" color={iconColor} />}
          label={
            directionsFetching ? (
              <ActivityIndicator />
            ) : (
              `${(directions?.routes[0].distance! / 1000 ?? 0).toFixed(1)} km`
            )
          }
        />
        <IconWithLabel
          icon={
            <MaterialCommunityIcons
              size={24}
              name="battery"
              color={iconColor}
            />
          }
          label={`%${battery?.toFixed(0)}`}
        />
        <IconWithLabel
          icon={
            <MaterialCommunityIcons
              size={24}
              name="cash"
              color={useTailwindColor("bg-gray-400")}
            />
          }
          label={`₺4.99 + ₺4.99/dk`}
        />
      </View>

      <View className="flex flex-row w-full justify-between">
        <InformationBoxButton invert text="Rezerve" onPress={onReserve} />
        <View className="w-2" />
        <InformationBoxButton text="QR Tara" onPress={onScanQr} />
      </View>
    </View>
  );
};

export default BiBipCarInformationBox;
