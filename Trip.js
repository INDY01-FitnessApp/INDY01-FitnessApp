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

/*
New Trips will have:
Start location (in lat. and long.) (string)
End location (in lat. and long.)
Start date (Date)
End date (null if in progress) (Date)
Total distance traveled (double)
Time spent exercising (in ms) (double)
*/
function createNewTrip(name, start, destination) {
  let trip = new Trip(name, start, destination);
  storage.save({
    key: "trip",
    id: name,
    data: trip,
  });
}
class Trip {
  constructor(name, start, destination) {
    this.name = name;
    this.startLocation = start;
    this.endLocation = destination;
    this.startDate = new Date();
    this.endDate = null;
    this.distanceTraveled = 0;
    this.exerciseTime = 0;
  }
}

function TripPreset(props) {
  return (
    <View style={[styles.card, props.top ? { marginTop: 10 } : {}]}>
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
    </View>
  );
}
export default function NewTripCreator() {
  return (
    <SafeAreaView style={styles.container}>
      <TripPreset start="here" destination="there" top={true} />
      <TripPreset start="here" destination="there" />
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
