import { useState, useEffect } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TextInputProps,
  Text,
  Image,
  View,
} from "react-native";
import globalStyles from "./GlobalStyles";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "./firebaseConfig.js";
import * as dbFunctions from "./DatabaseFunctions.js";

export default function LoginPage({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMessage, setErrMessage] = useState("");
  //allows existing users to login
  function login(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(`Logged in user ${user.uid}`);
        dbFunctions
          .getCurrentTrip(user.uid)
          .then((trip) =>
            navigation.replace("main", {
              currentTrip: trip,
            })
          )
          .catch((error) => {
            const errcode = error.code;
            const errmessage = error.message;
            console.log(errcode, errmessage);
          });
      })
      .catch((error) => {
        const errcode = error.code;
        const errmessage = error.message;
        setErrMessage = errmessage;
        if (errcode == "auth/invalid-credential") {
          console.log("Username or Password is incorrect");
          setErrMessage("Username or Password is incorrect");
        } else if (errcode == "auth/invalid-email") {
          console.log("Invalid Email");
          setErrMessage("Invalid Email");
        } else console.log(errmessage);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={{ width: 250, height: 250 }}
        source={require("./assets/logo.png")}
      />
      <Text style={globalStyles.heading}>Welcome!</Text>
      <TextInput
        placeholder="Email"
        inputMode="text"
        onChangeText={(text) => setEmail(text)}
        value={email}
        style={styles.textInput}
      />
      <TextInput
        placeholder="Password"
        inputMode="text"
        onChangeText={(text) => setPassword(text)}
        value={password}
        style={styles.textInput}
        secureTextEntry={true}
      />
      <Text style={{ fontSize: 15, color: "red", fontWeight: 200 }}>
        {errMessage}
      </Text>
      <Pressable
        style={globalStyles.button}
        onPressOut={() => navigation.navigate("resetPassword")}
      >
        <Text style={globalStyles.buttonText}>Forgot Password?</Text>
      </Pressable>
      <Pressable
        style={globalStyles.button}
        onPressOut={() => login(email, password)} // Replace() stops the user from accidentaly swiping back to the signup or login screens
      >
        <Text style={globalStyles.buttonText}>Log in</Text>
      </Pressable>
      {/* <Button title="Login" style={globalStyles.button} /> */}
      <View style={globalStyles.horizontalRule} />
      <Text style={{ fontSize: 20, color: "white", fontWeight: 500 }}>
        First time user?
      </Text>
      <Pressable
        style={globalStyles.button}
        onPressOut={() => navigation.navigate("signup")}
      >
        <Text style={globalStyles.buttonText}>Sign up</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexGrow: 1,
    backgroundColor: "#262626",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  text: {
    color: "white",
  },
  textInput: {
    width: "75%",
    height: 40,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 50,
    padding: 10,
  },
});
