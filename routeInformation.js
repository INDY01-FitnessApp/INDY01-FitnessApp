const routesURL = "https://routes.googleapis.com/directions/v2:computeRoutes";
// TODO: Get this tf out of here and into a proper environmental variable setup
const API_KEY = "AIzaSyCezscd8pminWXQ73BIxJMnQNq5zwDcZ28";

async function requestRoute(originLat, originLon, destLat, destLon) {
  // Set the API key and field mask.
  const apiKey = API_KEY;
  const fieldMask = "routes.distanceMeters,routes.polyline.encodedPolyline";
  // Create the request body.
  const requestBody = {
    origin: {
      location: {
        latLng: {
          latitude: originLat,
          longitude: originLon,
        },
      },
    },
    destination: {
      location: {
        latLng: {
          latitude: destLat,
          longitude: destLon,
        },
      },
    },
    travelMode: "WALK",
    polylineEncoding: "ENCODED_POLYLINE",
  };
  const headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask": fieldMask,
  };
  // fetch(routesURL, {
  //   method: "POST",
  //   headers: headers,
  //   body: JSON.stringify(requestBody),
  // })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     console.log("Response:");
  //     console.log(data);
  //     return data;
  //   })
  //   .catch((error) => {
  //     console.error("Error:");
  //     console.error(error);
  //     return null;
  //   });

  const response = await fetch(routesURL, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
  });
  const responseBody = await response.json();
  return responseBody;
}
// Returns distance between two coordinate points in miles
function distanceLatLon(lat1, lon1, lat2, lon2) {
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
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
  return metersToMiles(d * 1000); // Distance in mi
}

function metersToMiles(d) {
  return d / 1609.344;
}
export { requestRoute, distanceLatLon, metersToMiles };
