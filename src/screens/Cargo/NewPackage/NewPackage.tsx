import Mapbox from "@rnmapbox/maps";
import {
  FunctionComponent,
  RefObject,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  Keyboard,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { useTailwindColor } from "../../../utils/hooks/useTailwindColor";
import CustomTextInput from "../../../components/inputs/CustomTextInput/CustomTextInput";
import MarkerIcon from "../../../../assets/marker-icon.svg";
import { useFocusLocation } from "../../../utils/hooks/useFocusLocation";
import BiBipButton from "../../../components/buttons/BiBipButton/BiBipButton";
import { SafeAreaView } from "react-native-safe-area-context";
import Spinner from "react-native-loading-spinner-overlay";
import { SharedElement } from "react-navigation-shared-element";
import { promiseWithLoader } from "../../../utils/aws/api";
import { getReverseGeocode } from "../../../utils/api/mapbox";
import { Formik } from "formik";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface NewPackageProps {}

const NewPackage: FunctionComponent<NewPackageProps> = () => {
  const [markerCoordinate, setMarkerCoordinate] = useState([0, 0]);
  const [formShown, setFormShown] = useState(false);
  const [formValues, setFormValues] = useState({
    streetName: "",
    streetNo: "",
    floor: "",
    doorNo: "",
    directions: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const { camera, userLocation } = useFocusLocation();

  const getStreetName = async (markerCoordinate: number[]) => {
    const address = await promiseWithLoader(
      setIsLoading,
      getReverseGeocode(`${markerCoordinate[0]},${markerCoordinate[1]}`)
    );

    const feature = address?.features[0];
    const filteredContext = feature.context.filter((e) =>
      e.id.includes("locality")
    );
    if (filteredContext.length > 0)
      return `${feature.text}, ${filteredContext[0].text}`;

    return "";
  };

  const newPackageFormStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(
        formShown ? -Dimensions.get("window").height * 0.66 : 0
      ),
    };
  });

  return (
    <View className="flex flex-col w-full h-full bg-white">
      <Spinner visible={isLoading} />
      {/* <SharedElement
        className="h-full w-full flex flex-1"
        style={{ zIndex: -1 }}
        id="map"
      > */}
      <Mapbox.MapView
        className={`flex flex-1`}
        onCameraChanged={(s) => {
          setMarkerCoordinate(s.properties.center);
        }}
        onTouchStart={() => {
          Keyboard.dismiss();
          setFormShown(false);
        }}
        onPress={() => {
          Keyboard.dismiss();
          setFormShown(false);
        }}
        styleURL="mapbox://styles/eyub2001/clk2pmr3g00g301pf23265zbw"
      >
        <Mapbox.MarkerView coordinate={markerCoordinate}>
          <MarkerIcon width={75} height={75} />
        </Mapbox.MarkerView>
        <Mapbox.UserLocation visible ref={userLocation} />
        <Mapbox.Camera ref={camera} />
      </Mapbox.MapView>
      {/* </SharedElement> */}

      <Formik
        initialValues={{
          streetName: "",
          streetNo: "",
          floor: "",
          doorNo: "",
          directions: "",
        }}
        onSubmit={() => {}}
      >
        {({ values, handleChange, setFieldValue }) => (
          <View>
            <Animated.View style={newPackageFormStyle}>
              <NewPackageForm values={values} handleChange={handleChange} />
            </Animated.View>
            <SafeAreaView
              edges={["bottom"]}
              className="p-4 flex flex-grow-0 h-32"
            >
              <BiBipButton
                title="Devam Et"
                fullWidth
                rounding="large"
                onPress={async () => {
                  if (!formShown) {
                    const streetName = await getStreetName(markerCoordinate);
                    setFieldValue("streetName", streetName);
                    setFormShown(true);
                    return;
                  }
                }}
              />
            </SafeAreaView>
          </View>
        )}
      </Formik>
    </View>
  );
};

interface NewPackageFormProps {
  values: {
    streetName: string;
    streetNo: string;
    floor: string;
    doorNo: string;
    directions: string;
  };
  handleChange: {
    /** Classic React change handler, keyed by input name */
    (e: React.ChangeEvent<any>): void;
    /** Preact-like linkState. Will return a handleChange function.  */
    <T = string | React.ChangeEvent<any>>(
      field: T
    ): T extends React.ChangeEvent<any>
      ? void
      : (e: string | React.ChangeEvent<any>) => void;
  };
}

const NewPackageForm: FunctionComponent<NewPackageFormProps> = ({
  values: { streetName, streetNo, floor, doorNo, directions },
  handleChange,
}) => {
  const refs = useRef<Map<String, TextInput | null | undefined>>(new Map());

  return (
    <ScrollView
      className="flex flex-1 flex-col py-4 px-4"
      onScrollBeginDrag={() => {
        Keyboard.dismiss();
      }}
    >
      <CustomTextInput
        nativeID={"streetName"}
        onSubmitEditing={() => {
          const nextRef = refs.current.get("streetNo");
          nextRef?.focus();
        }}
        returnKeyType="next"
        ref={(ref) => {
          refs.current.set("streetName", ref);
        }}
        value={streetName}
        placeholder="Mahalle adı"
        onChangeText={handleChange("streetName")}
      />
      <View className="flex flex-row">
        <CustomTextInput
          nativeID={"streetNo"}
          value={streetNo}
          onSubmitEditing={() => {
            const nextRef = refs.current.get("floor");
            nextRef?.focus();
          }}
          returnKeyType="next"
          ref={(ref) => {
            refs.current.set("streetNo", ref);
          }}
          placeholder="Bina no."
          onChangeText={handleChange("streetNo")}
          side={"left"}
        />
        <CustomTextInput
          nativeID={"floor"}
          value={floor}
          onSubmitEditing={() => {
            const nextRef = refs.current.get("doorNo");
            nextRef?.focus();
          }}
          returnKeyType="next"
          ref={(ref) => {
            refs.current.set("floor", ref);
          }}
          placeholder="Kat"
          onChangeText={handleChange("floor")}
          side={"middle"}
        />
        <CustomTextInput
          nativeID={"doorNo"}
          value={doorNo}
          onSubmitEditing={() => {
            const nextRef = refs.current.get("directions");
            nextRef?.focus();
          }}
          returnKeyType="next"
          ref={(ref) => {
            refs.current.set("doorNo", ref);
          }}
          placeholder="Daire no."
          onChangeText={handleChange("doorNo")}
          side={"right"}
        />
      </View>
      <CustomTextInput
        nativeID={"directions"}
        value={directions}
        onSubmitEditing={() => {
          Keyboard.dismiss();
        }}
        returnKeyType="done"
        ref={(ref) => {
          refs.current.set("directions", ref);
        }}
        placeholder="Yol tarifi"
        onChangeText={handleChange("directions")}
      />
    </ScrollView>
  );
};

export default NewPackage;
