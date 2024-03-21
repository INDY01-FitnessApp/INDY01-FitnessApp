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
import { useEffect, useState, useRef } from "react";
import * as Location from "expo-location"; // TODO: Discuss replacing this with Pedometer
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

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Returns distance between two coordinate points in miles
function distanceLatLon(lat1, lon1, lat2, lon2) {
  // Uses the haversine formula to calculate the distance betwen 2 points on a sphere
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d / 1.609344; // Distance in mi
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
  const [location, setLocation] = useState(null);
  const [prevLocation, setPrevLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(
    "Please provide access to your location"
  );
  const [status, setStatus] = useState(null);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const locationCheckInterval = 10000; // 100000ms = 1sec
  const accuracyLevel = Location.Accuracy.Highest;

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  // Should only run once, does the initial setup of location
  useEffect(() => {
    let _status;
    // Load trip from data
    storage
      .load({
        key: "currentTrip",
      })
      .then((ret) => {
        setTrip(ret);
        setDistanceTraveled(ret.distanceTraveled);
      });
    console.log("Requesting location permissions");
    Location.requestForegroundPermissionsAsync({
      accuracy: accuracyLevel,
    }).then((res) => {
      _status = res.status;
      console.log("Location permissions: " + _status);
      if (_status !== "granted") {
        setErrorMsg(
          "Permission to access location was denied. Please allow location access in your settings."
        );
        return;
      }
      setErrorMsg(null);
      console.log("Accessing location");
      Location.getCurrentPositionAsync({
        accuracy: accuracyLevel,
      }).then((res) => {
        console.log("Location accessed");
        setPrevLocation(res);
        setStatus(_status); // Needs to be here so that the repeated location updates don't happen until this happens
      });
    });
  }, []);

  useInterval(() => {
    if (status == "granted") {
      // Update the distance in here
      console.log("Accessing location");
      Location.getCurrentPositionAsync({
        accuracy: accuracyLevel,
      })
        .then((res) => {
          console.log("Location accessed");
          let { latitude: lat1, longitude: lon1 } = prevLocation.coords;
          let { latitude: lat2, longitude: lon2 } = res.coords;
          let dist = distanceLatLon(lat1, lon1, lat2, lon2);
          setDistanceTraveled(distanceTraveled + dist);
        })
        .catch((err) => {
          console.log(err);
          if (err["code"] == "E_NO_PERMISSIONS") {
            setStatus(null);
            setErrorMsg(
              "Permission to access location was denied. Please allow location access in your settings."
            );
          }
        });
    }
  }, locationCheckInterval);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  // TODO: style this better
  return (
    <SafeAreaView style={styles.container}>
      {errorMsg ? (
        <View>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : (
        <View>
          <Text style={globalStyles.heading}>Current trip</Text>
          <Text style={globalStyles.heading}>
            From {trip.startLocation} to {trip.endLocation}, started on{" "}
            {trip.startDate}
          </Text>
          <Text style={globalStyles.heading}>
            Distance traveled: {distanceTraveled.toFixed(5)} miles
          </Text>
        </View>
      )}
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
  errorText: {
    color: "red",
    fontSize: 30,
  },
});
