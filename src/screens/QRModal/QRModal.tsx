import { FunctionComponent, useContext, useEffect, useState } from "react";
import { View } from "react-native";
import CameraView from "../../components/inputs/CameraView/CameraView";
import Spinner from "react-native-loading-spinner-overlay";
import UserContext from "../../utils/context/UserContext";
import BarcodeScanner from "../../components/inputs/BarcodeScanner/BarcodeScanner";
import { startTrip } from "./QRModal.action";
import { StackScreenProps } from "@react-navigation/stack";
import {
  AppSignedInStackParamList,
  BiBipHomeStackParamList,
} from "../../../Router";
import { Auth } from "aws-amplify";
import { getTripStatus, promiseWithLoader } from "../../utils/aws/api";

type NavigatorProps = StackScreenProps<BiBipHomeStackParamList, "QRModal">;

interface QRModalProps extends NavigatorProps {}

type CarQR = {
  carId: string;
};

const QRModal: FunctionComponent<QRModalProps> = ({ route, navigation }) => {
  const userContext = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);

  return (
    <View className="align-center justify-center h-full">
      <Spinner visible={isLoading} />
      <BarcodeScanner
        onBarCodeScanned={async (val) => {
          const car = JSON.parse(val.data) as CarQR;

          await promiseWithLoader(
            setIsLoading,
            startTrip(
              userContext.user?.getUsername()!,
              car.carId,
              route.params.location,
              userContext.token!
            ).then((res) => {
              if (res.status === 200) {
                navigation.goBack();
                getTripStatus(userContext.user!, userContext.token!).then(
                  (val) => {
                    userContext.setIsInTrip(val.inTrip);
                  }
                );
              }
            })
          );
        }}
      />
    </View>
  );
};

export default QRModal;
