import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import globalStyles from "./GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState, useRef } from "react";
import * as Location from "expo-location"; // TODO: Discuss replacing this with Pedometer
import {
  requestRoute,
  distanceLatLon,
  metersToMiles,
} from "./routeInformation";
import MapView, { Marker, Polyline } from "react-native-maps";
import { default as PolylineDecoder } from "@mapbox/polyline"; // Aliasing because the default export is 'polyline' which is too similar to 'Polyline' from react-native-maps
import * as dbFunctions from "./DatabaseFunctions";
import { auth } from "./firebaseConfig";
import lineSliceAlong from "@turf/line-slice-along";
import { lineString } from "@turf/helpers";
const { width, height } = Dimensions.get("window");
const SPACE = 0.04;
const POLYLINE_PRECISION = 5;
/*
New Trips will have:
Origin (string)
Origin coords (in lat. and long.) (numbers)
Destination
Destination coords(in lat. and long.)
Start date (Date)
End date (null if in progress) (Date)
Total distance traveled (double)
Time spent exercising (in ms) (double)
*/
// Saves trip to storage and then navigates to the trip view
async function createNewTrip(
  name,
  originName,
  originLat,
  originLon,
  destinationName,
  destinationLat,
  destinationLon,
  navigation
) {
  const res = await requestRoute(
    originLat,
    originLon,
    destinationLat,
    destinationLon
  );
  const route = res["routes"][0];
  const tripDistance = metersToMiles(route.distanceMeters);
  let trip = new Trip(
    name,
    originName,
    [originLat, originLon],
    destinationName,
    [destinationLat, destinationLon],
    tripDistance,
    route
  );

  dbFunctions.startNewTrip(
    auth.currentUser.uid,
    name,
    originName,
    [originLat, originLon],
    destinationName,
    [destinationLat, destinationLon],
    tripDistance,
    route
  );
  navigation.replace("tripView", { trip });
}

class Trip {
  constructor(
    name,
    originName,
    origin,
    destinationName,
    destination,
    totalDistance,
    route
  ) {
    this.tripName = name;
    this.originName = originName;
    this.origin = origin;
    this.destinationName = destinationName;
    this.destination = destination;
    this.currentDistance = 0;
    this.exerciseTime = 0;
    this.totalDistance = totalDistance;
    this.route = route;
  }
}

function TripPreset(props) {
  const navigation = useNavigation();
  return (
    <Pressable
      style={[styles.card, props.top ? { marginTop: 10 } : {}]}
      onPressOut={() => {
        createNewTrip(
          props.name,
          props.origin,
          props.originLat,
          props.originLon,
          props.destination,
          props.destinationLat,
          props.destinationLon,
          navigation
        );
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <View>
          <Text style={styles.cardText}>Start: {props.origin}</Text>
          <Text style={styles.cardText}>Destination: {props.destination}</Text>
        </View>
        <Image />
      </View>
    </Pressable>
  );
}

export function TripView({ route }) {
  const navigation = useNavigation();
  // This is such a mess holy shit
  const trip = route.params.trip;
  const locationCheckInterval = 10000; // 1000ms = 1sec
  const accuracyLevel = Location.Accuracy.Highest;

  const tripRoute = trip.route;
  const decodedPolyline = PolylineDecoder.decode(
    tripRoute.polyline.encodedPolyline,
    POLYLINE_PRECISION
  );
  // console.log(decodedPolyline);
  const fullPathLineString = lineString(decodedPolyline).geometry;
  const fullPathCoords = getPolylineCoordsFromLineString(fullPathLineString);
  //#region States
  const [prevLocation, setPrevLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(
    "Please provide access to your location"
  );
  const [status, setStatus] = useState(null);
  const [distanceTraveled, setDistanceTraveled] = useState(0);

  const [shortPathCoords, setShortPathCoords] = useState([]);
  const [startTime, setStartTime] = useState(null);
  //#endregion

  // Should only run once, does the initial setup of states and location
  useEffect(() => {
    let _status;
    console.log("Requesting initial location permissions");
    Location.requestForegroundPermissionsAsync({
      accuracy: accuracyLevel,
    }).then((res) => {
      _status = res.status;
      console.log("Initial location permissions: " + _status);
      if (_status !== "granted") {
        setErrorMsg(
          "Permission to access location was denied. Please allow location access in your settings."
        );
        return;
      }
      setErrorMsg(null);
      // Initialize states once location permission has been provided
      setStartTime(Date.now());
      console.log(trip.currentDistance);
      setDistanceTraveled(trip.currentDistance);
      console.log("Accessing inital location");
      Location.getCurrentPositionAsync({
        accuracy: accuracyLevel,
      }).then((res) => {
        console.log("Initial Location accessed");
        setPrevLocation(res);
        setStatus(_status); // Needs to be here so that the repeated location updates don't happen until this happens
      });
    });
  }, []);

  // Update the distance in here
  useInterval(() => {
    if (status == "granted") {
      // console.log("Accessing location");
      Location.getCurrentPositionAsync({
        accuracy: accuracyLevel,
      })
        .then((res) => {
          // console.log("Location accessed");
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

  // Given a line of given length defined by a set of coordinate pairs and a number from 0.00 - 1.00 p, calculates the line that is p percent along the original line
  // Not the "correct" way but close enough for a prototype
  function getLineAlongLine(coords, p) {
    if (coords.length == 0) return [];
    return coords.slice(0, Math.floor(coords.length * p));
  }
  function getPolylineCoordsFromLineString(arr) {
    const coords = [];
    arr.coordinates.forEach((pair) => {
      coords.push({
        latitude: pair[0],
        longitude: pair[1],
      });
    });
    return coords;
  }
  // Returns a Region object descirping where the MapView should be centered and the span of coordinates to display
  function getRegionFromCoords(
    originLat,
    originLon,
    destinationLat,
    destinationLon
  ) {
    const d = distanceLatLon(
      originLat,
      originLon,
      destinationLat,
      destinationLon
    );
    const centerLat = (originLat + destinationLat) / 2;
    const centerLon = (originLon + destinationLon) / 2;

    let dLat = (d * 2) / 100;
    if (d < 10) dLat = 0.1;
    // if (d > 1000) dLat = 50;

    const dLon = Math.abs(destinationLon - originLon);

    const latDelta = dLat + SPACE;
    const lonDelta = latDelta;
    return {
      latitude: centerLat,
      longitude: centerLon,
      latitudeDelta: latDelta,
      longitudeDelta: lonDelta,
    };
  }
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
    console.log("Requesting initial location permissions");
    Location.requestForegroundPermissionsAsync({
      accuracy: accuracyLevel,
    }).then((res) => {
      _status = res.status;
      console.log("Initial location permissions: " + _status);
      if (_status !== "granted") {
        setErrorMsg(
          "Permission to access location was denied. Please allow location access in your settings."
        );
        return;
      }
      setErrorMsg(null);
      console.log("Accessing inital location");
      Location.getCurrentPositionAsync({
        accuracy: accuracyLevel,
      }).then((res) => {
        console.log("Initial Location accessed");
        setPrevLocation(res);
        setStatus(_status); // Needs to be here so that the repeated location updates don't happen until this happens
      });
    });
  }, []);

  // Update the distance in here
  useInterval(() => {
    if (status == "granted") {
      // console.log("Accessing location");
      Location.getCurrentPositionAsync({
        accuracy: accuracyLevel,
      })
        .then((res) => {
          // console.log("Location accessed");
          let { latitude: lat1, longitude: lon1 } = prevLocation.coords;
          let { latitude: lat2, longitude: lon2 } = res.coords;
          let dist = distanceLatLon(lat1, lon1, lat2, lon2);
          let newDist = distanceTraveled + dist;
          setDistanceTraveled(distanceTraveled + dist);
          // Update the polyline
          let sLine = lineSliceAlong(fullPathLineString, 0, newDist, {
            units: "miles",
          });
          if (sLine.geometry.coordinates.length >= 2) {
            setShortPathCoords(getPolylineCoordsFromLineString(sLine.geometry));
          }

          // Check if trip is finished
          if (newDist >= route["distanceMeters"] / 1609.344) {
            // TODO: Trip finished
            console.log("Trip completed");
            endTrip(navigation);
          }
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

  function endSession(navigation) {
    const id = auth.currentUser.uid;
    const elapsedTime = Date.now() - startTime;

    dbFunctions.updateCurrentTrip(id, distanceTraveled, elapsedTime);
    navigation.replace("home");
  }
  function endTrip(navigation) {
    // Update distance traveled in database
    const id = auth.currentUser.uid;
    const elapsedTime = Date.now() - startTime;

    dbFunctions.updateCurrentTrip(id, distanceTraveled, elapsedTime);
    // If the trip is completed, update entries
    dbFunctions.addTripsCompleted(id); // Increment user's number of trips completed
    dbFunctions.addCompletedTrip(
      id,
      trip.name,
      trip.originName,
      trip.origin,
      trip.destinationName,
      trip.destination,
      trip.totalDistance,
      trip.exerciseTime + elapsedTime
    ); // Add trip to completed trips table
    dbFunctions.clearTrip(id); // Unsets the trip as the current trip from the user

    // Reroute back to homepage
    navigation.replace("home");
    return;
  }

  // TODO: style this better
  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={{
          width: "100%",
          height: "75%",
          flexGrow: 1,
        }}
        region={getRegionFromCoords(
          trip.origin[0],
          trip.origin[1],
          trip.destination[0],
          trip.destination[1]
        )}
        showsMyLocationButton={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        scrollEnabled={false}
        loadingEnabled={true}
        moveOnMarkerPress={false}
        followsUserLocation={false}
      >
        <Marker
          title="Origin"
          coordinate={{
            latitude: trip.origin[0],
            longitude: trip.origin[1],
          }}
        />
        <Marker
          title="Destination"
          coordinate={{
            latitude: trip.destination[0],
            longitude: trip.destination[1],
          }}
        />
        <Polyline
          coordinates={fullPathCoords}
          strokeColor="#888"
          strokeWidth={2}
        />
        <Polyline
          coordinates={shortPathCoords}
          strokeColor="#00f"
          strokeWidth={5}
        />
      </MapView>
      {errorMsg ? (
        <View style={styles.tripInfoContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : (
        <View style={styles.tripInfoContainer}>
          <Text style={styles.tripText}>
            From {trip.originName}
            {"\n"}to {trip.destinationName}
          </Text>
          <Text style={styles.tripText}>
            Distance traveled: {distanceTraveled.toFixed(2)} /{" "}
            {trip.totalDistance.toFixed(2)} miles
          </Text>
          <Pressable
            style={globalStyles.button}
            onPressOut={() => endSession(navigation)}
          >
            <Text style={globalStyles.buttonText}>End trip</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
export function NewTripCreator() {
  return (
    <SafeAreaView style={styles.container}>
      <TripPreset
        name="Marietta Campus - Kennesaw Campus"
        origin="KSU Marietta"
        originLat={33.94070244119528}
        originLon={-84.52045994166129}
        destination="KSU Kennesaw"
        destinationLat={34.03837620837588}
        destinationLon={-84.58152878773443}
        top={true}
      />
      <TripPreset
        name="New York Hotel, Las Vegas - Times Square, NYC "
        origin="New York-New York Hotel, Las Vegas"
        originLat={36.10225333213965}
        originLon={-115.1744225029821}
        destination="Times Square, NYC"
        destinationLat={40.75816158788552}
        destinationLon={-73.9855318740191}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: globalStyles.palette.backgroundDark,
    height: "100%",
  },
  tripInfoContainer: {
    flexShrink: 1,
    paddingTop: 10,
    width: "90%",
  },
  tripText: {
    fontSize: 20,
    color: "white",
    fontWeight: "600",
    fontFamily: "",
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
