import { View, StyleSheet, SafeAreaView, Text, Pressable } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import globalStyles from "./GlobalStyles";
import "react-native-gesture-handler";

function HomeComponent() {
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "column",
          marginTop: 90,
          height: 130,
          width: "70%",
        }}
      >
        <Text style={[globalStyles.heading, { textAlign: "center" }]}>
          Ready to start a new trip?
        </Text>
        <Pressable style={globalStyles.button}>
          <Text style={globalStyles.buttonText}>Start new trip →</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default function Home() {
  return (
    <Drawer.Navigator
      initialRouteName="homeC"
      screenOptions={{ headerShown: true, drawerType: "front" }}
    >
      <Drawer.Screen
        name="homeC"
        component={HomeComponent}
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
