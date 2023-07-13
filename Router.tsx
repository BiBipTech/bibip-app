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

export type AppSignedOutStackParamList = {
  Login: undefined;
  OTP: { phoneNumber: string; attempt: any };
  SignUp: { phoneNumber: string };
};

export type AppSignedInDrawerStackParamList = {};

export type AppSignedInDrawerParamList = {
  BiBipStack: undefined;
  CargoStack: undefined;
};

export type BiBipRootDrawerParamList = {
  BiBipHomeStack: undefined;
};

export type CargoRootDrawerParamList = {
  CargoHomeStack: undefined;
};

export type BiBipHomeStackParamList = {
  BiBipHome: undefined;
  QRModal: {
    location: LatLng;
  };
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

const AppSignedOutStack = createStackNavigator<AppSignedOutStackParamList>();
const AppSignedInDrawerStack =
  createStackNavigator<AppSignedInDrawerStackParamList>();
const AppSignedInDrawer = createDrawerNavigator<AppSignedInDrawerParamList>();

const BiBipRootDrawerNavigator =
  createDrawerNavigator<BiBipRootDrawerParamList>();
const CargoRootDrawerNavigator =
  createDrawerNavigator<CargoRootDrawerParamList>();

const BiBipHomeStackNavigator = createStackNavigator<BiBipHomeStackParamList>();
const BiBipTripStackNavigator = createStackNavigator<BiBipTripStackParamList>();

const CargoHomeStackNavigator = createStackNavigator<CargoHomeStackParamList>();

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

        <BiBipHomeStackNavigator.Screen
          options={{
            title: "Profil",
          }}
          name="Profile"
          component={Profile}
        />
        <BiBipHomeStackNavigator.Screen
          options={{ headerShown: false }}
          name="DocumentCamera"
          component={DocumentCamera}
        />

        <BiBipHomeStackNavigator.Screen
          options={{ title: "Sürüş Geçmişi" }}
          name="RideHistory"
          component={RideHistory}
        />
        <BiBipHomeStackNavigator.Screen
          options={{ title: "Ödeme Yöntemleri" }}
          name="PaymentMethods"
          component={PaymentMethods}
        />
        <BiBipHomeStackNavigator.Screen
          options={{ title: "Yeni Kart Ekle" }}
          name="AddNewCard"
          component={AddNewCard}
        />
        <BiBipHomeStackNavigator.Screen
          options={{ headerShown: false }}
          name="Success"
          component={Success}
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

  const App = () => {
    return (
      <AppSignedInDrawer.Navigator
        initialRouteName="BiBipStack"
        screenOptions={{
          headerShown: true,
        }}
        drawerContent={(props) => <CustomDrawer {...props} />}
      >
        <AppSignedInDrawer.Screen
          name="BiBipStack"
          options={{
            headerShown: false,
          }}
          component={BiBipHomeStack}
        />
        <AppSignedInDrawer.Screen
          name="CargoStack"
          options={{
            headerShown: false,
          }}
          component={CargoHomeStack}
        />
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
          <App />
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
