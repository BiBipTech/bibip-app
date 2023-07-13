import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { FunctionComponent, useContext, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import useCustomTailwind from "../../../utils/hooks/useCustomTailwind";
import UserContext from "../../../utils/context/UserContext";
import { Auth } from "aws-amplify";
import { useQuery } from "react-query";
import { getFunds } from "../../../utils/api/wallet";
import { AxiosError } from "axios";
import BiBipButton from "../../buttons/BiBipButton/BiBipButton";
import {
  MaterialCommunityIcons,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";

interface CustomDrawerProps extends DrawerContentComponentProps {}

const CustomCargoDrawer: FunctionComponent<CustomDrawerProps> = ({
  ...props
}) => {
  const userContext = useContext(UserContext);

  const [name, setName] = useState("");
  const [balance, setBalance] = useState(0);

  const { isLoading: nameLoading } = useQuery({
    queryKey: "name",
    queryFn: () => {
      Auth.currentAuthenticatedUser().then((val) => {
        setName(val.attributes.name);
        return val.attributes.name;
      });
    },
  });

  const { isLoading: balanceLoading } = useQuery({
    queryKey: "balance",
    queryFn: () => {
      getFunds(userContext.user?.getUsername()!, userContext.token!)
        .then((val) => {
          const { balance } = val.data;

          setBalance(balance);
        })
        .catch((err: AxiosError) => {});
    },
    enabled: !!userContext.token,
  });

  return (
    <View className="flex h-full w-full">
      <View className="bg-bibip-green-500 pt-10 rounded-b-2xl">
        <View className="p-6 justify-start items-start rounded-md">
          {!nameLoading ? (
            <Text className="text-xl text-white">
              Merhaba, {name.split(" ")[0]}
            </Text>
          ) : (
            <ActivityIndicator size={30} color="#FFFFFF" />
          )}
          <View className="flex flex-row mt-2 items-baseline">
            {!balanceLoading ? (
              <Text className="text-gray-100 mr-2">{balance.toFixed(2)}₺</Text>
            ) : (
              <ActivityIndicator className="mr-2" size={30} color="#FFFFFF" />
            )}
            <FontAwesome5 name="coins" size={14} color="#fff" />
            <View className="ml-2">
              <BiBipButton
                title="Bakiye Yükle"
                intent={"secondary"}
                mini
                fontSize="mini"
              />
            </View>
          </View>
        </View>
      </View>
      <DrawerContentScrollView
        contentContainerStyle={useCustomTailwind("-mt-10")}
      >
        <View className="flex flex-1 bg-white">
          <DrawerItem
            label={"Profil"}
            onPress={() => {
              props.navigation.navigate("Profile");
            }}
            labelStyle={useCustomTailwind("text-gray-500 -ml-6")}
            icon={() => (
              <FontAwesome5 name="user-circle" size={20} color="#6b7280" />
            )}
          />
          <DrawerItem
            label={"Sürüş Geçmişi"}
            onPress={() => {
              props.navigation.navigate("RideHistory");
            }}
            labelStyle={useCustomTailwind("text-gray-500 -ml-6")}
            icon={() => (
              <MaterialCommunityIcons
                name="history"
                size={20}
                color="#6b7280"
              />
            )}
          />
          <DrawerItem
            label={"Ödeme Yöntemleri"}
            onPress={() => {
              props.navigation.navigate("PaymentMethods");
            }}
            labelStyle={useCustomTailwind("text-gray-500 -ml-6")}
            icon={() => (
              <AntDesign name="creditcard" size={20} color="#6b7280" />
            )}
          />
          <DrawerItem
            label={"Yardım"}
            onPress={() => {
              // props.navigation.navigate("RideHistory");
            }}
            labelStyle={useCustomTailwind("text-gray-500 -ml-6")}
            icon={() => (
              <AntDesign name="questioncircleo" size={20} color="#6b7280" />
            )}
          />
          <DrawerItem
            label={"Ayarlar"}
            onPress={() => {
              // props.navigation.navigate("RideHistory");
            }}
            labelStyle={useCustomTailwind("text-gray-500 -ml-6")}
            icon={() => (
              <Ionicons name="settings-sharp" size={20} color="#6b7280" />
            )}
          />
          <DrawerItem
            label={"Çıkış Yap"}
            onPress={async () => {
              userContext.user?.signOut();
              userContext.setUser(undefined);
            }}
            labelStyle={useCustomTailwind("text-gray-500 -ml-6")}
            icon={() => (
              <Ionicons name="log-out-outline" size={20} color="#6b7280" />
            )}
          />
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomCargoDrawer;
