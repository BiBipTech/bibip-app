import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Login from "./src/screens/Login/Login";
import Home from "./src/screens/Home/Home";
import OTP from "./src/screens/OTP/OTP";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
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

export type RootStackParamList = {
  Login: undefined;
  OTP: { phoneNumber: string; attempt: any };
  SignUp: { phoneNumber: string };
};

export type TripStackParamList = {
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

export type HomeStackParamList = {
  Map: undefined;
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

export type RootDrawerParamList = {
  MapStack: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootDrawerParamList>();
const HomeNavigator = createStackNavigator<HomeStackParamList>();
const TripNavigator = createStackNavigator<TripStackParamList>();

const Router = () => {
  const userContext = useContext(UserContext);
  const username = userContext.user?.getUsername();

  const netInfo = useNetInfo();

  const RootStack = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="OTP" component={OTP} />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{
            headerShown: true,
            title: "Yeni Hesap",
            headerBackTitle: "Geri",
          }}
        />
      </Stack.Navigator>
    );
  };

  const HomeStack = () => {
    return (
      <HomeNavigator.Navigator
        screenOptions={{
          headerShown: true,
        }}
        initialRouteName="Map"
      >
        <HomeNavigator.Screen
          options={{ headerShown: false, title: "Harita" }}
          name="Map"
          component={Home}
        />
        <HomeNavigator.Screen
          name="QRModal"
          options={{
            presentation: "modal",
            headerShown: false,
            gestureResponseDistance: 350,
          }}
          component={QRModal}
        />
        <HomeNavigator.Screen
          options={{ title: "Profil" }}
          name="Profile"
          component={Profile}
        />
        <HomeNavigator.Screen
          options={{ headerShown: false, presentation: "modal" }}
          name="DocumentCamera"
          component={DocumentCamera}
        />

        <HomeNavigator.Screen
          options={{ title: "Sürüş Geçmişi" }}
          name="RideHistory"
          component={RideHistory}
        />
        <HomeNavigator.Screen
          options={{ title: "Ödeme Yöntemleri" }}
          name="PaymentMethods"
          component={PaymentMethods}
        />
        <HomeNavigator.Screen
          options={{ title: "Yeni Kart Ekle", headerBackTitle: "Geri" }}
          name="AddNewCard"
          component={AddNewCard}
        />
        <HomeNavigator.Screen
          options={{ headerShown: false }}
          name="Success"
          component={Success}
        />
      </HomeNavigator.Navigator>
    );
  };

  const TripStack = () => {
    return (
      <TripNavigator.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <TripNavigator.Screen name="Trip" component={Trip} />
        <TripNavigator.Screen name="TripEnd" component={TripEnd} />
        <TripNavigator.Screen name="Camera" component={TripCamera} />
        <TripNavigator.Screen name="TripSummary" component={TripSummary} />
      </TripNavigator.Navigator>
    );
  };

  if (netInfo && netInfo.isInternetReachable !== null) {
    if (!netInfo.isInternetReachable) {
      return <NoInternet />;
    }
  } else if (netInfo.isInternetReachable === null) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      {userContext.isLoading ? (
        <Loading />
      ) : userContext.user ? (
        !userContext.isInTrip ? (
          <Drawer.Navigator
            screenOptions={{
              headerShown: true,
            }}
            initialRouteName="MapStack"
            backBehavior="initialRoute"
            drawerContent={(props) => <CustomDrawer {...props} />}
          >
            <Drawer.Screen
              name="MapStack"
              component={HomeStack}
              options={{
                headerShown: false,
                title: "Harita",
              }}
            />
          </Drawer.Navigator>
        ) : (
          <TripStack />
        )
      ) : (
        <RootStack />
      )}
    </NavigationContainer>
  );
};

export default Router;
