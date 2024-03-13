import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import MainView from "./Main";
import LoginPage from "./Login";
import SignupPage from "./Signup";

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="login" component={LoginPage} />
        <Stack.Screen name="signup" component={SignupPage} />
        <Stack.Screen name="main" component={MainView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator();
const styles = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: "dodgerblue",
    alignItems: "center",
    justifyContent: "center",
  },
});
