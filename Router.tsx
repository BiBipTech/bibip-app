import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Login from "./src/screens/Login/Login";
import Home from "./src/screens/Home/Home";
import OTP from "./src/screens/OTP/OTP";
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const Router = () => {
  const isLogged = false;

  const LoginStack = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="OTP" component={OTP} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    );
  };

  return (
    <NavigationContainer>
      {isLogged ? (
        <Drawer.Navigator>
          <Drawer.Screen name="Home" component={Home} />
        </Drawer.Navigator>
      ) : (
        <LoginStack />
      )}
    </NavigationContainer>
  );
};

export default Router;
