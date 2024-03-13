import {
  Platform,
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Pressable,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import globalStyles from "./GlobalStyles";
import "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NewTripCreator from "./Trip";

function HomeComponent() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "column",
          marginTop: 90,
          height: 180,
          width: "70%",
        }}
      >
        <Text style={[globalStyles.heading, { textAlign: "center" }]}>
          Ready to start a new trip?
        </Text>
        <Pressable
          style={globalStyles.button}
          onPressOut={() => navigation.navigate("newTripCreator")}
        >
          <Text style={globalStyles.buttonText}>
            {Platform.OS === "ios" ? "Start new trip ↦" : "Start new trip"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function HomePage() {
  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="home" component={HomeComponent} />
      <Stack.Screen name="newTripCreator" component={NewTripCreator} />
    </Stack.Navigator>
  );
}

export default function MainView() {
  return (
    <Drawer.Navigator
      initialRouteName="homePage"
      screenOptions={{ headerShown: true, drawerType: "front" }}
    >
      <Drawer.Screen
        name="homePage"
        component={HomePage}
        options={{ title: "Home" }}
      />
      <Drawer.Screen
        name="home1"
        component={HomeComponent}
        options={{ title: "Page2" }}
      />
      <Drawer.Screen
        name="home2"
        component={HomeComponent}
        options={{ title: "Page3" }}
      />
      <Drawer.Screen
        name="home3"
        component={HomeComponent}
        options={{ title: "Page4" }}
      />
    </Drawer.Navigator>
  );
}
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
    width: "100%",
    flexDirection: "column",
    backgroundColor: globalStyles.palette.backgroundDark,
    alignItems: "center",
  },
});
