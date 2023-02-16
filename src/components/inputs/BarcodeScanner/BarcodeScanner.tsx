import { FunctionComponent, useState } from "react";
import {
  BarCodeScanner,
  BarCodeEvent,
  BarCodeScannerProps,
} from "expo-barcode-scanner";
import { StyleSheet, View } from "react-native";
import BiBipIconButton from "../../buttons/BiBipIconButton/BiBipIconButton";
import Ionicons from "@expo/vector-icons/Ionicons";

interface BarcodeScannerProps extends BarCodeScannerProps {}

const BarcodeScanner: FunctionComponent<BarcodeScannerProps> = ({
  onBarCodeScanned,
}) => {
  const [scanned, setScanned] = useState(false);

  const handleBarcodeScanned = (res: BarCodeEvent) => {
    setScanned(true);
    if (onBarCodeScanned) {
      onBarCodeScanned(res);
    }
  };

  return (
    <BarCodeScanner
      onBarCodeScanned={scanned ? undefined : handleBarcodeScanned}
      style={StyleSheet.absoluteFillObject}
      type="back"
    ></BarCodeScanner>
  );
};

export default BarcodeScanner;
