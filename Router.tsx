import {
  CompositeScreenProps,
  NavigationContainer,
} from "@react-navigation/native";
import {
  StackScreenProps,
  createStackNavigator,
} from "@react-navigation/stack";
import {
  DrawerScreenProps,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import Login from "./src/screens/Login/Login";
import Home from "./src/screens/Home/Home";
import OTP from "./src/screens/OTP/OTP";
import React, { Dispatch, SetStateAction, useContext } from "react";
import UserContext from "./src/utils/context/UserContext";
import QRModal from "./src/screens/QRModal/QRModal";
import Loading from "./src/screens/Loading/Loading";
import Trip from "./src/screens/Trip/Trip/Trip";
import { LatLng } from "react-native-maps";
import { useNetInfo } from "@react-native-community/netinfo";
import NoInternet from "./src/screens/NoInternet/NoInternet";
import TripEnd from "./src/screens/Trip/TripEnd/TripEnd";
import TripCamera from "./src/screens/Trip/TripCamera/TripCamera";
import { PhotoType } from "./src/screens/Trip/TripEnd/TripEnd.type";
import TripSummary from "./src/screens/Trip/TripSummary/TripSummary";
import CustomDrawer from "./src/components/views/CustomDrawer/CustomDrawer";
import RideHistory from "./src/screens/Menu/RideHistory/RideHistory";
import PaymentMethods from "./src/screens/Menu/PaymentMethods/PaymentMethods";
import AddNewCard from "./src/screens/AddNewCard/AddNewCard";
import Success from "./src/screens/Menu/Success/Success";
import Profile from "./src/screens/Menu/Profile/Profile";
import DocumentCamera from "./src/screens/Menu/DocumentCamera/DocumentCamera";
import SignUp from "./src/screens/SignUp/SignUp";
import Landing from "./src/screens/Landing/Landing";
import CargoHome from "./src/screens/Cargo/Home/CargoHome";
import CustomCargoDrawer from "./src/components/views/CargoDrawer/CargoDrawer";
import { Text, TouchableOpacity, View } from "react-native";
import useCustomTailwind from "./src/utils/hooks/useCustomTailwind";
import ChargeStationHome from "./src/screens/ChargingStation/Home/ChargeStationHome";
import Test from "./src/screens/Test";

export type AppSignedOutStackParamList = {
  Login: undefined;
  OTP: { phoneNumber: string; attempt: any };
  SignUp: { phoneNumber: string };
};

export type AppSignedInStackParamList = {
  BiBipStack: undefined;
  CargoStack: undefined;
  ChargeStationStack: undefined;
  Test: undefined;
  Profile: undefined;
  DocumentCamera: {
    document: "id" | "license" | "photo";
  };
  RideHistory: undefined;
  PaymentMethods: undefined;
  AddNewCard: undefined;
  Success: undefined;
  Error: undefined;
};

export type AppSignedInDrawerParamList = {
  AppStack: undefined;
};

export type BiBipRootDrawerParamList = {
  BiBipHomeStack: undefined;
};

export type CargoRootDrawerParamList = {
  CargoHomeStack: undefined;
};
//BiBipHomeStackParamList
export type BiBipHomeStackParamList = {
  BiBipHome: undefined;
  QRModal: {
    location: LatLng;
  };
};

export type BiBipTripStackParamList = {
  Trip: {
    carId: string;
  };
  TripEnd: {
    carId?: string;
    waypoints?: { lat: number; lng: number }[];
  };
  TripSummary: {
    tripId: string;
  };
  Camera: {
    data: { type: PhotoType; value: string }[];
    setData: Dispatch<SetStateAction<{ type: PhotoType; value: string }[]>>;
    type: PhotoType;
    currentRoute: {
      carId?: string;
      waypoints?: { lat: number; lng: number }[];
    };
  };
};

export type CargoHomeStackParamList = {
  CargoHome: undefined;
};

export type ChargeStationHomeStackParamList = {
  ChargeStationHome: undefined;
};

const AppSignedOutStack = createStackNavigator<AppSignedOutStackParamList>();
const AppSignedInStack = createStackNavigator<AppSignedInStackParamList>();
const AppSignedInDrawer = createDrawerNavigator<AppSignedInDrawerParamList>();

const BiBipRootDrawerNavigator =
  createDrawerNavigator<BiBipRootDrawerParamList>();
const CargoRootDrawerNavigator =
  createDrawerNavigator<CargoRootDrawerParamList>();

const BiBipHomeStackNavigator = createStackNavigator<BiBipHomeStackParamList>();
const BiBipTripStackNavigator = createStackNavigator<BiBipTripStackParamList>();

const CargoHomeStackNavigator = createStackNavigator<CargoHomeStackParamList>();

const ChargeStationHomeStackNavigator =
  createStackNavigator<ChargeStationHomeStackParamList>();

export type AppDrawerBiBipHomeStackCompositeProps<
  T extends keyof BiBipHomeStackParamList
> = CompositeScreenProps<
  StackScreenProps<BiBipHomeStackParamList, T>,
  DrawerScreenProps<AppSignedInDrawerParamList>
>;

export type AppDrawerCargoHomeStackCompositeProps<
  T extends keyof CargoHomeStackParamList
> = CompositeScreenProps<
  StackScreenProps<CargoHomeStackParamList, T>,
  DrawerScreenProps<AppSignedInDrawerParamList>
>;

export type AppDrawerChargeStationHomeStackCompositeProps<
  T extends keyof ChargeStationHomeStackParamList
> = CompositeScreenProps<
  StackScreenProps<ChargeStationHomeStackParamList, T>,
  DrawerScreenProps<AppSignedInDrawerParamList>
>;

const Router = () => {
  const userContext = useContext(UserContext);

  const netInfo = useNetInfo();

  const AppSignedOut = () => {
    return (
      <AppSignedOutStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <AppSignedOutStack.Screen name="Login" component={Login} />
        <AppSignedOutStack.Screen name="OTP" component={OTP} />
        <AppSignedOutStack.Screen
          name="SignUp"
          component={SignUp}
          options={{
            headerShown: true,
            title: "Yeni Hesap",
            headerBackTitle: "Geri",
          }}
        />
      </AppSignedOutStack.Navigator>
    );
  };

  const BiBipHomeStack = () => {
    return (
      <BiBipHomeStackNavigator.Navigator
        screenOptions={{
          headerShown: true,
        }}
        initialRouteName="BiBipHome"
      >
        <BiBipHomeStackNavigator.Screen
          options={{ headerShown: false, title: "Harita" }}
          name="BiBipHome"
          component={Home}
        />
        <BiBipHomeStackNavigator.Screen
          name="QRModal"
          options={{
            presentation: "modal",
            headerShown: false,
            gestureResponseDistance: 350,
          }}
          component={QRModal}
        />
      </BiBipHomeStackNavigator.Navigator>
    );
  };

  const BiBipTripStack = () => {
    return (
      <BiBipTripStackNavigator.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <BiBipTripStackNavigator.Screen name="Trip" component={Trip} />
        <BiBipTripStackNavigator.Screen name="TripEnd" component={TripEnd} />
        <BiBipTripStackNavigator.Screen name="Camera" component={TripCamera} />
        <BiBipTripStackNavigator.Screen
          name="TripSummary"
          component={TripSummary}
        />
      </BiBipTripStackNavigator.Navigator>
    );
  };

  const BiBipDrawer = () => {
    return (
      <BiBipRootDrawerNavigator.Navigator
        screenOptions={{
          headerShown: true,
        }}
        initialRouteName="BiBipHomeStack"
        backBehavior="initialRoute"
        drawerContent={(props) => <CustomDrawer {...props} />}
      >
        <BiBipRootDrawerNavigator.Screen
          name="BiBipHomeStack"
          component={BiBipHomeStack}
          options={{
            headerShown: false,
            title: "Harita",
          }}
        />
      </BiBipRootDrawerNavigator.Navigator>
    );
  };

  const CargoHomeStack = () => {
    return (
      <CargoHomeStackNavigator.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <CargoHomeStackNavigator.Screen
          name="CargoHome"
          component={CargoHome}
        />
      </CargoHomeStackNavigator.Navigator>
    );
  };

  const ChargeStationStack = () => {
    return (
      <ChargeStationHomeStackNavigator.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <ChargeStationHomeStackNavigator.Screen
          name="ChargeStationHome"
          component={ChargeStationHome}
        />
      </ChargeStationHomeStackNavigator.Navigator>
    );
  };

  const CargoDrawer = () => {
    return (
      <CargoRootDrawerNavigator.Navigator
        screenOptions={{
          headerShown: true,
        }}
        initialRouteName="CargoHomeStack"
        backBehavior="initialRoute"
        drawerContent={(props) => <CustomCargoDrawer {...props} />}
      >
        <CargoRootDrawerNavigator.Screen
          name="CargoHomeStack"
          component={CargoHomeStack}
          options={{
            headerShown: false,
            title: "Harita",
          }}
        />
      </CargoRootDrawerNavigator.Navigator>
    );
  };

  const AppStack = () => {
    return (
      <AppSignedInStack.Navigator initialRouteName="BiBipStack">
        <AppSignedInStack.Screen
          name="BiBipStack"
          options={{
            headerShown: false,
          }}
          component={BiBipHomeStack}
        />
        <AppSignedInStack.Screen
          name="CargoStack"
          options={{
            headerShown: false,
          }}
          component={CargoHomeStack}
        />
        <AppSignedInStack.Screen
          name="ChargeStationStack"
          options={{
            headerShown: false,
          }}
          component={ChargeStationStack}
        />
        <AppSignedInStack.Screen name="Test" component={Test} />
        <AppSignedInStack.Screen
          options={{
            title: "Profil",
            headerBackTitle: "Geri",
          }}
          name="Profile"
          component={Profile}
        />
        <AppSignedInStack.Screen
          options={{ headerShown: false }}
          name="DocumentCamera"
          component={DocumentCamera}
        />

        <AppSignedInStack.Screen
          options={{ title: "Sürüş Geçmişi", headerBackTitle: "Geri" }}
          name="RideHistory"
          component={RideHistory}
        />
        <AppSignedInStack.Screen
          options={{ title: "Ödeme Yöntemleri", headerBackTitle: "Geri" }}
          name="PaymentMethods"
          component={PaymentMethods}
        />
        <AppSignedInStack.Screen
          options={{ title: "Yeni Kart Ekle", headerBackTitle: "Geri" }}
          name="AddNewCard"
          component={AddNewCard}
        />
        <AppSignedInStack.Screen
          options={{ headerShown: false }}
          name="Success"
          component={Success}
        />
      </AppSignedInStack.Navigator>
    );
  };

  const AppDrawer = () => {
    return (
      <AppSignedInDrawer.Navigator
        initialRouteName="AppStack"
        screenOptions={{
          headerShown: false,
        }}
        drawerContent={(props) => <CustomDrawer {...props} />}
      >
        <AppSignedInDrawer.Screen name="AppStack" component={AppStack} />
      </AppSignedInDrawer.Navigator>
    );
  };

  if (netInfo && netInfo.isInternetReachable !== null) {
    if (!netInfo.isInternetReachable) {
      return <NoInternet />;
    }
  } else if (netInfo.isInternetReachable === null) {
    return <Loading />;
  }

  if (!userContext.isLoading && !userContext.user) {
    return (
      <NavigationContainer>
        <AppSignedOut />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {userContext.isLoading || userContext.isInTripLoading ? (
        <Loading />
      ) : userContext.user ? (
        !userContext.isInTrip ? (
          <AppDrawer />
        ) : (
          <BiBipTripStack />
        )
      ) : (
        <AppSignedOut />
      )}
    </NavigationContainer>
  );
};

export default Router;
