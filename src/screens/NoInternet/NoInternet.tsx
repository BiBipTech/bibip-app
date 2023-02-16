import { FunctionComponent, useEffect } from "react";
import { Alert, BackHandler, Text, View } from "react-native";

interface NoInternetProps {}

const NoInternet: FunctionComponent<NoInternetProps> = () => {
  useEffect(() => {
    Alert.alert(
      "İnternet Yok ",
      "BiBip kullanabilmek için internet bağlantısına sahip olmanız ve wi-fi aktif olması gerekmektedir.",
      [
        {
          text: "Tamam",
          onPress: () => {
            BackHandler.exitApp();
          },
        },
      ]
    );
  }, []);

  return (
    <View className="h-full justify-center items-center">
      <Text></Text>
    </View>
  );
};

export default NoInternet;
