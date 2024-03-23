import { SafeAreaView, StyleSheet, Text } from "react-native";
import MapView from "react-native-maps";
import globalStyles from "./GlobalStyles";

export default function TripMap() {
  return (
    <SafeAreaView
      style={{
        display: "flex",
        height: "100%",
      }}
    >
      <MapView
        style={{
          witdh: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
      <Text style={{}}>Hello</Text>
    </SafeAreaView>
  );
}
