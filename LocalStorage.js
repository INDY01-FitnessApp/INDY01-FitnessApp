import Storage from "react-native-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Documentation: https://github.com/sunnylqm/react-native-storage
const storage = new Storage({
  storageBackend: AsyncStorage,
  defaultExpires: null, // Entries will not expire unless a specific expiry time is specified during save
  // Write async methods that run if the code tries to access a key or key-id in storage that does not exist
  sync: {},
});
const allKeys = ["trip", "currentTrip"]; // Store all keys here, so we have a record of every key in storage
export default storage;
