import { StackScreenProps } from "@react-navigation/stack";
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  TouchableOpacity,
  Animated,
  Keyboard,
  Pressable,
  TextInput,
  View,
  ScrollView,
} from "react-native";
import * as Linking from "expo-linking";

import MaskInput from "react-native-mask-input";
import { AppSignedInStackParamList } from "../../../Router";
import BiBipButton from "../../components/buttons/BiBipButton/BiBipButton";
import { warn } from "../../utils/api/alert";
import UserContext, { UserContextType } from "../../utils/context/UserContext";
import { addCard } from "./AddNewCard.action";
import { promiseWithLoader } from "../../utils/aws/api";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { listCards, saveCardToDb } from "../../utils/api/pbm";
import { matchMaskedPan } from "../../utils/api/card";

type NavigatorProps = StackScreenProps<AppSignedInStackParamList, "AddNewCard">;

interface AddNewCardProps extends NavigatorProps {}

const AddNewCard: FunctionComponent<AddNewCardProps> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [cardNo, setCardNo] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [cvv, setCvv] = useState("");

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const keyboardAnimation = useRef(new Animated.Value(24)).current;

  const userContext = useContext(UserContext);

  useEffect(() => {
    Keyboard.removeAllListeners("keyboardWillHide");
    Keyboard.removeAllListeners("keyboardWillShow");

    const show = Keyboard.addListener("keyboardWillShow", (e) => {
      Animated.timing(keyboardAnimation, {
        toValue: e.endCoordinates.height,
        duration: 215,
        useNativeDriver: false,
      }).start();
    });
    const hide = Keyboard.addListener("keyboardWillHide", (e) => {
      Animated.timing(keyboardAnimation, {
        toValue: 24,
        duration: 215,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const validate = () => {
    if (!validateAllFields()) return;
    if (!validateCardNo()) return;
    if (!validateYear()) return;
    return true;
  };

  const validateYear = () => {
    if (year.length < 4) {
      warn(
        "Son geçerlilik yılı yanlış!",
        "Lütfen kartının son geçerlilik yılını 4 haneli olacak şekilde girdiğine emin ol!",
        () => {},
        "Tamam"
      );
      return false;
    }

    return true;
  };

  const validateCardNo = () => {
    if (cardNo.split(" ").join("").length < 16) {
      warn(
        "Kart numarası yanlış!",
        "Lütfen 16 hanelik kart numaranı eksiksiz girdiğine emin ol!",
        () => {},
        "Tamam"
      );
      return false;
    }
    return true;
  };

  const validateAllFields = () => {
    if (
      cardHolder.length <= 0 ||
      cardNo.length <= 0 ||
      month.length <= 0 ||
      year.length <= 0 ||
      cvv.length <= 0
    ) {
      warn(
        "Eksik alan!",
        "Lütfen bütün alanları doldurduğundan emin ol!",
        () => {},
        "Tamam"
      );
      return false;
    }

    return true;
  };

  const validateMonth = (month: string) => {
    const rg = new RegExp("^(0[1-9]|1[0-2])");
    if (rg.test(month) || month.length < 2) {
      setMonth(month);
    }
  };

  return (
    <View className="h-full pb-12 justify-center p-4">
      <Spinner visible={isLoading} />
      <ScrollView className="flex flex-col flex-grow">
        <Pressable onPress={Keyboard.dismiss} className="flex flex-grow">
          <MaskInput
            className="bg-white text-lg rounded-xl p-4 text-gray-500 border border-gray-300"
            keyboardType="numeric"
            multiline
            maxLength={19}
            value={cardNo}
            onChangeText={setCardNo}
            placeholder="Kart Numarasi"
            placeholderTextColor={"#9ca3af"}
            mask={[
              /\d/,
              /\d/,
              /\d/,
              /\d/,
              " ",
              /\d/,
              /\d/,
              /\d/,
              /\d/,
              " ",
              /\d/,
              /\d/,
              /\d/,
              /\d/,
              " ",
              /\d/,
              /\d/,
              /\d/,
              /\d/,
            ]}
          />
          <TextInput
            className="bg-white text-lg rounded-xl p-4 mt-4 text-gray-500 border border-gray-300"
            multiline
            value={cardHolder}
            onChangeText={setCardHolder}
            placeholder="Kart Ustundeki Isim"
            placeholderTextColor={"#9ca3af"}
          />
          <View className="flex flex-row mt-4">
            <TextInput
              className="w-1/3 p-4 border border-gray-300 text-lg text-gray-500 flex-grow bg-white rounded-l-lg"
              keyboardType="numeric"
              placeholder="Ay"
              placeholderTextColor={"#9ca3af"}
              multiline
              value={month}
              onChangeText={validateMonth}
              maxLength={2}
            />
            <MaskInput
              className="w-1/3 p-4 border border-gray-300 text-lg text-gray-500 flex-grow bg-white border-l-0"
              keyboardType="numeric"
              placeholder="Yil"
              placeholderTextColor={"#9ca3af"}
              multiline
              value={year}
              onChangeText={setYear}
              mask={[/\d/, /\d/, /\d/, /\d/]}
              maxLength={4}
            />
            <MaskInput
              className="w-1/3 p-4 border border-gray-300 text-lg text-gray-500 bg-white rounded-r-lg border-l-0"
              placeholder="CVV"
              placeholderTextColor={"#9ca3af"}
              multiline
              value={cvv}
              onChangeText={setCvv}
              keyboardType="numeric"
              mask={[/\d/, /\d/, /\d/]}
              maxLength={3}
            />
          </View>
        </Pressable>
      </ScrollView>

      <Animated.View
        className="justify-end pb-8"
        style={{
          paddingBottom: keyboardAnimation,
        }}
      >
        <BiBipButton
          title="Ekle"
          onPress={async () => {
            if (!validate()) {
              return;
            }

            const res = await promiseWithLoader(
              setIsLoading,
              addCard(cardNo, month, year, cvv, userContext, cardHolder)
            );

            const parsedUrl = Linking.parse(res);

            if (parsedUrl.path === "success") {
              const cards = (await listCards(userContext.user?.getUsername()!))
                .data.CardList;
              for (let i = 0; i < cards.length; i++) {
                const card = cards[i];

                if (
                  matchMaskedPan(card.maskedPan, cardNo.split(" ").join(""))
                ) {
                  const res = await saveCardToDb(
                    userContext.user?.getUsername()!,
                    card.cardGuid,
                    cardHolder
                  );
                }
              }
              navigation.navigate("Success");
            } else {
            }
          }}
        />
      </Animated.View>
    </View>
  );
};

export default AddNewCard;
