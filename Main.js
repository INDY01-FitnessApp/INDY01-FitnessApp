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
import { useContext, useEffect, useState } from "react";
import Profile from "./Profile";
import TripMap from "./TripMap";
import { app, auth, db } from "./firebaseConfig.js";
import {
  getDatabase,
  ref,
  get,
  set,
  child,
  push,
  update,
  onValue,
} from "firebase/database";
import * as dbFunctions from "./DatabaseFunctions.js";
import { CurrentTripContext } from "./currentTripContext.js";

function HomeComponent() {
  const navigation = useNavigation();
  const [currentTrip, setCurrentTrip] = useState(null);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("")
  let ct = useContext(CurrentTripContext);
  useEffect(() => {
    dbFunctions.getUserInfo(auth.currentUser.uid).then(res => setUser(res))
  }, [])
  useEffect(() => {
    dbFunctions
      .getCurrentTrip(auth.currentUser.uid)
      .then((res) => setCurrentTrip(res));
  }, []);
  useEffect(() => {
    if (user)
      setUsername(user.Username)
  }, [user])
  function msToTimeString(ms) {
    sec = ms / 1000
    min = Math.floor(sec / 60)
    hr = Math.floor(min / 60)
    minRemaining = min % 60
    hrStr = hr.toString().padStart(2, "0")
    minStr = minRemaining.toString().padStart(2, "0")
    return `${hrStr}:${minStr}`
  }
  return (
    <SafeAreaView style={styles.container}>
      {currentTrip && currentTrip.tripName != "none" ? (
        // Trip exists already
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "column",
            marginTop: 90,
            height: 400,
            width: "70%",
          }}
        >
          <Text style={[globalStyles.heading, {textAlign: "center"}] }>Hi {username}!</Text>
          <Text style={[globalStyles.heading, { textAlign: "center" }]}>
            Ready to exercise?
          </Text>
          <Pressable
            style={globalStyles.button}
            onPressOut={() =>
              navigation.replace("tripView", { trip: currentTrip })
            }
          >
            <Text style={globalStyles.buttonText}>Continue trip</Text>
          </Pressable>
          <View >
            <Text style={globalStyles.heading}>{currentTrip.tripName}</Text>
            <Text style={styles.tripInfo}>Progress: {(currentTrip.currentDistance * 100 / currentTrip.totalDistance).toFixed(2)}%</Text>
            <Text style={styles.tripInfo}>Time spent: {msToTimeString(currentTrip.exerciseTime)}</Text>
          </View>
        </View>
      ) : (
        // Trip does not exist yet
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
            <Text style={[globalStyles.heading, {textAlign: "center"}] }>Hi {username}!</Text>
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

export default function MainView({ route }) {
  return (
    <CurrentTripContext.Provider value={route.params.currentTrip}>
      <Drawer.Navigator
        initialRouteName="homePage"
        screenOptions={{
          headerShown: true,
          drawerType: "front",
          headerStyle: {
            backgroundColor: "#000",
          },
          headerTintColor: "#fff",
        }}
      >
        <Drawer.Screen
          name="homePage"
          component={HomePage}
          options={{ title: "Home" }}
        />
        <Drawer.Screen
          name="profile"
          component={Profile}
          options={{ title: "Profile" }}
        />
      </Drawer.Navigator>
    </CurrentTripContext.Provider>
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
    gap: "20px"
  },
  tripInfo: {
    color: "white",
    fontSize: 25
  }
});
