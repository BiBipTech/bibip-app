import { StackScreenProps } from "@react-navigation/stack";
import { FunctionComponent, useContext, useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { useQuery } from "react-query";
import {
  AppSignedInDrawerParamList,
  AppSignedInStackParamList,
} from "../../../../Router";
import BiBipButton from "../../../components/buttons/BiBipButton/BiBipButton";
import WalletCard from "../../../components/views/WalletCard/WalletCard";
import { getDefaultCard, listCards } from "../../../utils/api/pbm";
import UserContext from "../../../utils/context/UserContext";

type NavigatorProps = StackScreenProps<
  AppSignedInStackParamList,
  "PaymentMethods"
>;

interface PaymentMethodsProps extends NavigatorProps {}

const PaymentMethods: FunctionComponent<PaymentMethodsProps> = ({
  navigation,
  route,
}) => {
  const userContext = useContext(UserContext);

  const {
    isLoading: cardsLoading,
    data: cards,
    refetch,
  } = useQuery({
    queryKey: "listCards",
    queryFn: () =>
      listCards(userContext.user?.getUsername()!).then((val) => {
        return val.data.CardList;
      }),
  });

  const { isLoading: defaultCardLoading, data: defaultCard } = useQuery({
    queryKey: "defaultCard",
    queryFn: () =>
      getDefaultCard(userContext.user?.getUsername()!).then((val) => {
        return val.data.cardGuid;
      }),
  });

  useEffect(() => {
    refetch();
  }, []);

  return (
    <View className="flex flex-col p-4 h-full pb-8">
      <Spinner visible={cardsLoading || defaultCardLoading} />
      <WalletCard />
      <FlatList
        className="mt-4"
        horizontal
        ListEmptyComponent={() => (
          <View className="h-40 rounded-3xl items-center justify-center w-[90vw] bg-bibip-blue-500">
            <Text className="text-white">Kayıtlı kart yok!</Text>
          </View>
        )}
        data={cards}
        renderItem={({ item }) => {
          return (
            <View className="h-40 rounded-3xl items-center justify-center w-[90vw] bg-bibip-blue-500">
              <Text>{item.id}</Text>
            </View>
          );
        }}
      ></FlatList>
      <View className="flex-grow justify-end">
        <BiBipButton
          title="Kart Ekle"
          onPress={() => {
            navigation.navigate("AddNewCard");
          }}
        />
      </View>
    </View>
  );
};

export default PaymentMethods;
