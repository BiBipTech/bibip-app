import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Login from "./src/screens/Login/Login";
import Home from "./src/screens/Home/Home";
import OTP from "./src/screens/OTP/OTP";
import { Dispatch, SetStateAction, useContext } from "react";
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

export type AppRootStackParamList = {
  Login: undefined;
  OTP: { phoneNumber: string; attempt: any };
  SignUp: { phoneNumber: string };
};

export type AppStackParamList = {
  BiBipDrawer: undefined;
  CargoStack: undefined;
  Landing: undefined;
};

export type CargoRootStackParamList = {
  CargoHome: undefined;
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

export type BiBipHomeStackParamList = {
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

const AppRootStack = createStackNavigator<AppRootStackParamList>();

const AppStack = createStackNavigator<AppStackParamList>();

const CargoRootStackNavigator = createStackNavigator<CargoRootStackParamList>();

const BiBipRootDrawerNavigator = createDrawerNavigator<RootDrawerParamList>();
const BiBipHomeStackNavigator = createStackNavigator<BiBipHomeStackParamList>();
const BiBipTripStackNavigator = createStackNavigator<BiBipTripStackParamList>();

const Router = () => {
  const userContext = useContext(UserContext);

  const netInfo = useNetInfo();

  const AppRoot = () => {
    return (
      <AppRootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <AppRootStack.Screen name="Login" component={Login} />
        <AppRootStack.Screen name="OTP" component={OTP} />
        <AppRootStack.Screen
          name="SignUp"
          component={SignUp}
          options={{
            headerShown: true,
            title: "Yeni Hesap",
            headerBackTitle: "Geri",
          }}
        />
      </AppRootStack.Navigator>
    );
  };

  const BiBipHomeStack = () => {
    return (
      <BiBipHomeStackNavigator.Navigator
        screenOptions={{
          headerShown: true,
        }}
        initialRouteName="Map"
      >
        <BiBipHomeStackNavigator.Screen
          options={{ headerShown: false, title: "Harita" }}
          name="Map"
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
          options={{ title: "Profil" }}
          name="Profile"
          component={Profile}
        />
        <BiBipHomeStackNavigator.Screen
          options={{ headerShown: false, presentation: "modal" }}
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
          options={{ title: "Yeni Kart Ekle", headerBackTitle: "Geri" }}
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
        initialRouteName="MapStack"
        backBehavior="initialRoute"
        drawerContent={(props) => <CustomDrawer {...props} />}
      >
        <BiBipRootDrawerNavigator.Screen
          name="MapStack"
          component={BiBipHomeStack}
          options={{
            headerShown: false,
            title: "Harita",
          }}
        />
      </BiBipRootDrawerNavigator.Navigator>
    );
  };

  const CargoStack = () => {
    return (
      <CargoRootStackNavigator.Navigator>
        <CargoRootStackNavigator.Screen name="CargoHome" component={Loading} />
      </CargoRootStackNavigator.Navigator>
    );
  };

  const App = () => {
    return (
      <AppStack.Navigator
        initialRouteName="BiBipDrawer"
        screenOptions={{
          headerShown: false,
        }}
      >
        <AppStack.Screen name="BiBipDrawer" component={BiBipDrawer} />
        <AppStack.Screen name="CargoStack" component={CargoStack} />
      </AppStack.Navigator>
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
        <AppRoot />
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
        <AppRoot />
      )}
    </NavigationContainer>
  );
};

export default Router;
