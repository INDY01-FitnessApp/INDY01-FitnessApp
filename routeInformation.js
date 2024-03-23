const routesURL = "https://routes.googleapis.com/directions/v2:computeRoutes";
// TODO: Get this tf out of here and into a proper environmental variable setup
const API_KEY = "AIzaSyCezscd8pminWXQ73BIxJMnQNq5zwDcZ28";

async function requestRoute(startLat, startLon, destLat, destLon) {
  const response = await fetch(routesURL, {
    method: "POST",
    body: {
      origin: {
        location: {
          latLng: {
            latitude: startLat,
            longitude: startLon,
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
      computeAlternativeRoutes: false,
      languageCode: "en-US",
      units: "IMPERIAL",
    },
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": "*", // Replace the * with a proper field mask, details at https://developers.google.com/maps/documentation/routes/choose_fields
    },
  });
  const route = await response.json();
  return route;
}
export { requestRoute };
