import { FunctionComponent, useContext, useEffect, useState } from "react";
import { Dimensions, Text, View } from "react-native";
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
import { Circle, Defs, Mask, Path, Rect, Svg } from "react-native-svg";

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
      <View
        style={{
          width: Dimensions.get("window").width,
          height: "100%",
          position: "absolute",
        }}
      >
        <Svg viewBox="0 0 200 300">
          <Path
            fill="rgba(0,0,0,0.5)"
            d="M0 550v-800h200v800H0Zm138-360a2 2 0 0 0 2-2v-76a2 2 0 0 0-2-2H62a2 2 0 0 0-2 2v76a2 2 0 0 0 2 2h76Z"
          />
          <Path
            fill="none"
            stroke="#23a65e"
            d="M62 190a2 2 0 0 1-2-2v-20.5h.5v20a2 2 0 0 0 2 2h20v.5H62Zm-2-78a2 2 0 0 1 2-2h20.5v.5h-20a2 2 0 0 0-2 2v20H60V112Zm78-2a2 2 0 0 1 2 2v20.5h-.5v-20a2 2 0 0 0-2-2h-20v-.5H138Zm2 78a2 2 0 0 1-2 2h-20.5v-.5h20a2 2 0 0 0 2-2v-20h.5V188Z"
          />
        </Svg>
        <Text className="absolute bottom-64 text-3xl text-white text-center w-full">
          Scan QR
        </Text>
      </View>
    </View>
  );
};

export default QRModal;
