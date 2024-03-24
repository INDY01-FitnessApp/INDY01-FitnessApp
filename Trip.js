// TODO: use Turf.js to improve geospatial calculations
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import storage from "./LocalStorage";
import globalStyles from "./GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState, useRef } from "react";
import * as Location from "expo-location"; // TODO: Discuss replacing this with Pedometer
import { requestRoute, distanceLatLon } from "./routeInformation";
import MapView, { Marker, Polyline } from "react-native-maps";
import { default as PolylineDecoder } from "@mapbox/polyline"; // Aliasing because the default export is 'polyline' which is too similar to 'Polyline' from react-native-maps

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const SPACE = 0.04;
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
  origin,
  originLat,
  originLon,
  destination,
  destinationLat,
  destinationLon,
  navigation
) {
  let trip = new Trip(
    name,
    origin,
    originLat,
    originLon,
    destination,
    destinationLat,
    destinationLon
  );
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
  constructor(
    name = "",
    origin = "",
    originLat = 0,
    originLon = 0,
    destination = "",
    destinationLat = 0,
    destinationLon = 0
  ) {
    this.name = name;
    this.origin = origin;
    this.originCoords = [originLat, originLon];
    this.destination = destination;
    this.destinationCoords = [destinationLat, destinationLon];
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

export function TripView() {
  // This is such a mess holy shit
  const [trip, setTrip] = useState(null);
  const [location, setLocation] = useState(null);
  const [prevLocation, setPrevLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(
    "Please provide access to your location"
  );

  const [status, setStatus] = useState(null);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const locationCheckInterval = 10000; // 100000ms = 1sec
  const accuracyLevel = Location.Accuracy.Highest;

  const [route, setRoute] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [originMarkerCoords, setOriginMarkerCoords] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [destinationMarkerCoords, setDestinationMarkerCoords] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [fullPathCoords, setFullPathCoords] = useState([]);
  const [shortPathCoords, setShortPathCoords] = useState([]);
  function setPolylineCoordsFromGeoJSON(arr, setter) {
    const coords = [];
    arr.forEach((pair) => {
      coords.push({
        latitude: pair[0],
        longitude: pair[1],
      });
    });
    setter(coords);
  }
  // Given a line of given length defined by a set of coordinate pairs and a number from 0.00 - 1.00 p, calculates the line that is p percent along the original line
  // Not the "correct" way but close enough for a prototype
  function getLineAlongLine(coords, p) {
    if (coords.length == 0) return [];
    return coords.slice(0, Math.floor(coords.length * p));
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
    const dLat = Math.abs(destinationLat - originLat);
    const dLon = Math.abs(destinationLon - originLon);
    const latDelta = dLat * 1.1 + SPACE;
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
    // Load trip from data
    storage
      .load({
        key: "currentTrip",
      })
      .then((ret) => {
        setTrip(ret);
        setDistanceTraveled(ret.distanceTraveled);
      });
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

  // Request route information about the trip
  useEffect(() => {
    if (trip) {
      requestRoute(
        trip.originCoords[0],
        trip.originCoords[1],
        trip.destinationCoords[0],
        trip.destinationCoords[1]
      )
        .then((res) => {
          setRoute(res["routes"][0]);
        })
        .catch((err) => console.log("Error: " + err.message));
    }
  }, [trip]);

  // Update the map visuals when the route is updated
  useEffect(() => {
    if (route) {
      setMapRegion(
        getRegionFromCoords(
          trip.originCoords[0],
          trip.originCoords[1],
          trip.destinationCoords[0],
          trip.destinationCoords[1]
        )
      );
      setOriginMarkerCoords({
        latitude: trip.originCoords[0],
        longitude: trip.originCoords[1],
      });
      setDestinationMarkerCoords({
        latitude: trip.destinationCoords[0],
        longitude: trip.destinationCoords[1],
      });
      let decodedPolyline = PolylineDecoder.decode(
        route["polyline"]["encodedPolyline"],
        5
      );
      setPolylineCoordsFromGeoJSON(decodedPolyline, setFullPathCoords);
      let sLine = getLineAlongLine(decodedPolyline, 0.4);
      setPolylineCoordsFromGeoJSON(sLine, setShortPathCoords);
    }
  }, [route]);

  useInterval(() => {
    if (status == "granted") {
      // Update the distance in here
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

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
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
        region={mapRegion}
        showsMyLocationButton={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        scrollEnabled={false}
        loadingEnabled={true}
        moveOnMarkerPress={false}
        followsUserLocation={false}
      >
        <Marker title="Origin" coordinate={originMarkerCoords} />
        <Marker title="Destination" coordinate={destinationMarkerCoords} />
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
          <Text style={styles.tripText}>Current trip</Text>
          <Text style={styles.tripText}>
            From {trip.origin} to {trip.destination}, started on{" "}
            {trip.startDate}
          </Text>
          <Text style={styles.tripText}>
            Distance traveled: {distanceTraveled.toFixed(2)} miles
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
export function NewTripCreator() {
  return (
    <SafeAreaView style={styles.container}>
      <TripPreset
        name="Marietta Campus - Kenessaw Campus"
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
    // alignItems: "flex-start",
    backgroundColor: globalStyles.palette.backgroundDark,
    height: "100%",
  },
  tripInfoContainer: {
    flexShrink: 1,
    paddingTop: 10,
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
