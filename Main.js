import {
  Platform,
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Pressable,
  Button,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import globalStyles from "./GlobalStyles";
import "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NewTripCreator, TripView } from "./Trip";
import storage from "./LocalStorage";
import { useState } from "react";
import * as SQLite from 'expo-sqlite';
import { insertProfileInfo, insertDistanceTraveled, insertCurrentTrip, getData, updateDistanceTraveled, updateCurrentDistance } from "./Database.ts"
import { helper, fetch } from "./Signup.js"
function HomeComponent() {
  const navigation = useNavigation();
  const [hasCurrentTrip, setHasCurrentTrip] = useState(false);

  storage
    .load({ key: "currentTrip" })
    .then((ret) => setHasCurrentTrip(!!ret))
    .catch((err) => {
      if (err.name != "NotFoundError") console.warn(err);
    });
  return (
    <SafeAreaView style={styles.container}>
      {hasCurrentTrip ? (
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
            Ready to exercise?
          </Text>
          <Pressable
            style={globalStyles.button}
            onPressOut={() => navigation.replace("tripView")}
          >
            <Text style={globalStyles.buttonText}>Continue trip</Text>
          </Pressable>
        </View>
      ) : (
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
            <Text style={globalStyles.buttonText}>Start new trip</Text>
          </Pressable>
        </View>
      )}
      <Button
        title="Clear data"
        onPress={() => {
          storage.remove({ key: "currentTrip" });
        }}
      />
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
      <Stack.Screen name="tripView" component={TripView} />
    </Stack.Navigator>
  );
}

export default function MainView() {
    //helper('god');
    return (
    <Drawer.Navigator
      initialRouteName="homePage"
      screenOptions={{ headerShown: true, drawerType: "front" }}
    >
      <Drawer.Screen
        name="homePage"
        component={HomePage}
        options={{ title: 'Home' }}
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
