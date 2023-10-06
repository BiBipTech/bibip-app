import {
  CompositeScreenProps,
  NavigationContainer,
} from "@react-navigation/native";
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
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
import CargoHome from "./src/screens/Cargo/Home/CargoHome";
import CustomCargoDrawer from "./src/components/views/CargoDrawer/CargoDrawer";
import ChargeStationHome from "./src/screens/ChargingStation/Home/ChargeStationHome";
import TrackPackage from "./src/screens/Cargo/TrackPackage/TrackPackage";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import NewPackage from "./src/screens/Cargo/NewPackage/NewPackage";
import ChargeStationComment from "./src/screens/ChargingStation/Comment/ChargeStationComment";
import ChargeStationCommentList from "./src/screens/ChargingStation/CommentList/ChargeStationCommentList";
import ChargeStationReport from "./src/screens/ChargingStation/Report/ChargeStationReport";
import Test from "./src/screens/Test";
import Reserve from "./src/screens/Reserve/Reserve";

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
    carId?: string;
  };
  Reserve: {
    carId: string;
    tripStarted: number;
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
  TrackPackage: undefined;
  NewPackage: undefined;
};

export type ChargeStationHomeStackParamList = {
  ChargeStationHome: undefined;
  ChargeStationComment: {
    stationId: number;
  };
  ChargeStationReport: {
    stationId: number;
  };
  ChargeStationCommentList: {
    stationId: number;
  };
};

const AppSignedOutStack =
  createNativeStackNavigator<AppSignedOutStackParamList>();
const AppSignedInStack =
  createNativeStackNavigator<AppSignedInStackParamList>();
const AppSignedInDrawer = createDrawerNavigator<AppSignedInDrawerParamList>();

const BiBipHomeStackNavigator =
  createNativeStackNavigator<BiBipHomeStackParamList>();
const BiBipTripStackNavigator =
  createNativeStackNavigator<BiBipTripStackParamList>();

const CargoHomeStackNavigator =
  createSharedElementStackNavigator<CargoHomeStackParamList>();

const ChargeStationHomeStackNavigator =
  createNativeStackNavigator<ChargeStationHomeStackParamList>();

export type AppDrawerBiBipHomeStackCompositeProps<
  T extends keyof BiBipHomeStackParamList
> = CompositeScreenProps<
  NativeStackScreenProps<BiBipHomeStackParamList, T>,
  DrawerScreenProps<AppSignedInDrawerParamList>
>;

export type AppDrawerCargoHomeStackCompositeProps<
  T extends keyof CargoHomeStackParamList
> = CompositeScreenProps<
  NativeStackScreenProps<CargoHomeStackParamList, T>,
  DrawerScreenProps<AppSignedInDrawerParamList>
>;

export type AppDrawerChargeStationHomeStackCompositeProps<
  T extends keyof ChargeStationHomeStackParamList
> = CompositeScreenProps<
  NativeStackScreenProps<ChargeStationHomeStackParamList, T>,
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
          }}
          component={QRModal}
        />
        <BiBipHomeStackNavigator.Screen
          name="Reserve"
          options={{
            headerShown: false,
            title: "Rezervasyon",
            presentation: "modal",
            gestureEnabled: false,
          }}
          component={Reserve}
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
          // sharedElements={() => {
          //   return [
          //     {
          //       id: "test",
          //       animation: "fade-in",
          //       align: "auto",
          //       resize: "clip",
          //     },
          //     {
          //       id: "map",
          //     },
          //   ];
          // }}
        />
        <CargoHomeStackNavigator.Screen
          name="TrackPackage"
          component={TrackPackage}
          options={{
            title: "Kargo Takip",
            headerBackTitle: "Geri",
            headerShown: true,
          }}
          // sharedElements={() => {
          //   return [
          //     {
          //       id: "test",
          //       animation: "fade-in",
          //       align: "auto",
          //       resize: "clip",
          //     },
          //   ];
          // }}
        />
        <CargoHomeStackNavigator.Screen
          name="NewPackage"
          component={NewPackage}
          options={{
            headerShown: true,
            title: "Yeni Kargo",
            headerBackTitle: "Geri",
          }}
          // sharedElements={() => [
          //   {
          //     id: "map",
          //   },
          // ]}
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
        <ChargeStationHomeStackNavigator.Screen
          name="ChargeStationComment"
          component={ChargeStationComment}
          options={{
            headerShown: true,
            headerTitle: "Yorum Yap",

            headerBackTitle: "Geri",
          }}
        />
        <ChargeStationHomeStackNavigator.Screen
          name="ChargeStationCommentList"
          component={ChargeStationCommentList}
          options={{
            headerShown: true,
            headerTitle: "Yorumlar",
            headerBackTitle: "Geri",
          }}
        />
        <ChargeStationHomeStackNavigator.Screen
          name="ChargeStationReport"
          component={ChargeStationReport}
          options={{
            headerShown: true,
            headerTitle: "Raporla",
            headerBackTitle: "Geri",
          }}
        />
      </ChargeStationHomeStackNavigator.Navigator>
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
        {/* <AppSignedInStack.Screen
          name="CargoStack"
          options={{
            headerShown: false,
          }}
          component={CargoHomeStack}
        />*/}
        <AppSignedInStack.Screen
          name="ChargeStationStack"
          options={{
            headerShown: false,
          }}
          component={ChargeStationStack}
        />
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
        <AppSignedInStack.Screen
          options={{ headerShown: true }}
          name="Test"
          component={Test}
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
          swipeEnabled: false,
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
