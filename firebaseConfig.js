// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase, ref } from "firebase/database";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOirAfhHYpOPCnBJZNZQ8byK_3vr3fAi4",
  authDomain: "indy-1-fitnessapp.firebaseapp.com",
  databaseURL: "https://indy-1-fitnessapp-default-rtdb.firebaseio.com",
  projectId: "indy-1-fitnessapp",
  storageBucket: "indy-1-fitnessapp.appspot.com",
  messagingSenderId: "678736197689",
  appId: "1:678736197689:web:d7acd341fc6057937535e8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export default app;
