import { StyleSheet, SafeAreaView, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import "react-native-gesture-handler";

function HomeComponent() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Home</Text>
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
        options={{ title: "Page1" }}
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
    flex: 1,
    flexDirection: "column",
    backgroundColor: "dodgerblue",
    alignItems: "center",
    justifyContent: "center",
  },
});
