import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import storage from "./LocalStorage";
import globalStyles from "./GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
/*
New Trips will have:
Start location (in lat. and long.) (string)
End location (in lat. and long.)
Start date (Date)
End date (null if in progress) (Date)
Total distance traveled (double)
Time spent exercising (in ms) (double)
*/
async function createNewTrip(name, start, destination, navigation) {
  let trip = new Trip(name, start, destination);
  storage
    .save({
      key: "currentTrip",
      data: trip,
    })
    .then(() => {
      navigation.replace("tripView");
    })
    .catch((err) => console.log(err));
}
class Trip {
  constructor(name, start, destination) {
    this.name = name;
    this.startLocation = start;
    this.endLocation = destination;
    this.startDate = new Date().toLocaleDateString();
    this.endDate = null;
    this.distanceTraveled = 0;
    this.exerciseTime = 0;
  }
}

function TripPreset(props) {
  const navigation = useNavigation();
  return (
    <Pressable
      style={[styles.card, props.top ? { marginTop: 10 } : {}]}
      onPressOut={() => {
        createNewTrip(props.name, props.start, props.destination, navigation);
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <View>
          <Text style={styles.cardText}>Start: {props.start}</Text>
          <Text style={styles.cardText}>Destination: {props.destination}</Text>
        </View>
        <Image />
      </View>
    </Pressable>
  );
}

export function TripView() {
  const [trip, setTrip] = useState(new Trip("...", "...", "..."));
  storage
    .load({
      key: "currentTrip",
    })
    .then((ret) => {
      setTrip(ret);
    });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={globalStyles.heading}>Current trip</Text>
      <Text style={globalStyles.heading}>
        From {trip.startLocation} to {trip.endLocation}, started on{" "}
        {trip.startDate}
      </Text>
      <Text style={globalStyles.heading}>
        Distance traveled: {trip.distanceTraveled}
      </Text>
    </SafeAreaView>
  );
}
export function NewTripCreator() {
  return (
    <SafeAreaView style={styles.container}>
      <TripPreset name="Trip 1" start="here" destination="there" top={true} />
      <TripPreset name="Trip 2" start="here" destination="there" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: globalStyles.palette.backgroundDark,
    padding: 10,
    height: "100%",
  },
  card: {
    borderRadius: "10%",
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    width: "90%",
  },
  cardText: {
    fontSize: 20,
    fontWeight: "600",
  },
});
