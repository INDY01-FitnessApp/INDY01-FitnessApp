import {
  SafeAreaView,
  StyleSheet,
  Text,
  Dimensions,
  Button,
  Pressable,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import globalStyles from "./GlobalStyles";
import { default as PolylineDecoder } from "@mapbox/polyline"; // Aliasing because the default export is 'polyline' which is too similar to 'Polyline' from react-native-maps
import { requestRoute, distanceLatLon } from "./routeInformation";
import { useState } from "react";
const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const SPACE = 0.04;

// Given a line of given length defined by a set of coordinate pairs and a number from 0.00 - 1.00 p, calculates the line that is p percent along the original line
function getLineAlongLine(coords, originalLength, p) {
  if (coords.length == 0) return [];
  return coords.slice(0, Math.floor(coords.length * p));
  // function distanceBetweenPoints(x1, y1, x2, y2) {
  //   let dx = x2 - x1;
  //   let dy = y2 - y1;
  //   return Math.sqrt(dx ** 2 + dy ** 2);
  // }
  // let newCoords = [];
  // newCoords.push(coords[0]);
  // /*
  // d = distance left = p percent of original length
  //   For each 2 pairs of coordinate pairs P1 and P2 in coords:
  //     l = distance between the two coordinates
  //     if d = 0:
  //     Line ends at P1
  //     else if d < l:
  //     The line must end between P1 and P2
  //     Find what percentage of l d is
  //     Find a point that percentage along P2 - P1
  //     That is where the line ends
  //     else if d == l:
  //     The line must end at P2
  //     else:
  //     The line must continue through P1 and P2
  //     d -= l
  //     Check P2 and next pair P3
  // */
  // let d = originalLength * p;
  // console.log(d);
  // for (let i = 0; i < coords.length - 1; i++) {
  //   let P1 = coords[i];
  //   let P2 = coords[i + 1];
  //   let l = distanceLatLon(P1[0], P1[1], P2[0], P2[1]);
  //   if (d == 0) {
  //     return newCoords;
  //   } else if (d < l) {
  //     let dx = P2[0] - P1[0];
  //     let dy = P2[1] - P1[1];
  //     let percentage = d / l;
  //     newCoords.push([P1[0] + percentage * dx, P1[1] + percentage * dy]);
  //     return newCoords;
  //   } else if (d == l) {
  //     newCoords.push(P2);
  //     return newCoords;
  //   } else {
  //     newCoords.push(P2);
  //     d -= l;
  //   }
  // }
  // return newCoords;
}
export default function TripMap(props) {
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
  // Returns a Region object descirping where the MapView should be centered and the span of coordinates to display
  function getRegionFromCoords(
    originLat,
    originLon,
    destinationLat,
    destinationLon
  ) {
    const dLat = destinationLat - originLat;
    const dLon = destinationLon - originLon;
    const latDelta = dLat * 1.1 + SPACE;
    const lonDelta = latDelta * ASPECT_RATIO;
    return {
      latitude: originLat + dLat / 2,
      longitude: originLon + dLon / 2,
      latitudeDelta: latDelta,
      longitudeDelta: lonDelta,
    };
  }
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
        region={getRegionFromCoords(
          33.94070244119528,
          -84.52045994166129,
          34.03837620837588,
          -84.58152878773443
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
            latitude: 33.94070244119528,
            longitude: -84.52045994166129,
          }}
        />
        <Marker
          title="Destination"
          coordinate={{
            latitude: 34.03837620837588,
            longitude: -84.58152878773443,
          }}
        />
        <Marker
          title="Center"
          coordinate={{
            latitude: getRegionFromCoords(
              33.94070244119528,
              -84.52045994166129,
              34.03837620837588,
              -84.58152878773443
            ).latitude,
            longitude: getRegionFromCoords(
              33.94070244119528,
              -84.52045994166129,
              34.03837620837588,
              -84.58152878773443
            ).longitude,
          }}
        />
        <Polyline
          coordinates={fullPathCoords}
          strokeColor="#f00"
          strokeWidth={5}
        />
        <Polyline
          coordinates={shortPathCoords}
          strokeColor="#0f0"
          strokeWidth={5}
        />
      </MapView>
      <Pressable
        onPress={() =>
          requestRoute(
            33.94070244119528,
            -84.52045994166129,
            34.03837620837588,
            -84.58152878773443
          ).then((res) => {
            let decodedPolyline = PolylineDecoder.decode(
              res["routes"][0]["polyline"]["encodedPolyline"],
              5
            );
            console.log(res["routes"][0]["distanceMeters"]);
            setPolylineCoordsFromGeoJSON(decodedPolyline, setFullPathCoords);
            let shorterPolyline = getLineAlongLine(
              decodedPolyline,
              res["routes"][0]["distanceMeters"],
              0.5
            );
            setPolylineCoordsFromGeoJSON(shorterPolyline, setShortPathCoords);
            requestRoute(
              33.94070244119528,
              -84.52045994166129,
              shorterPolyline[shorterPolyline.length - 1][0],
              shorterPolyline[shorterPolyline.length - 1][1]
            ).then((res) => console.log(res["routes"][0]["distanceMeters"]));
          })
        }
      >
        <Text style={{ fontSize: 30 }}>Press me</Text>
      </Pressable>
    </SafeAreaView>
  );
}
