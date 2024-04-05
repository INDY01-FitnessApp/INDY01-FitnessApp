import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  Image,
  View,
} from "react-native";
import globalStyles from "./GlobalStyles";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { app, auth, db } from './firebaseConfig.js';
import { getDatabase, ref, get, set } from "firebase/database"

export default function SignupPage({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  //allows for the creation of a new user
    async function createUser(email, password, userName, firstName, lastName) {
        
        await(createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
            navigation.replace("login");
        })
            .catch((error) => {
                const errcode = error.code;
                const errmessage = error.message;
                console.log(errcode, errmessage);
            }));
        
        await (set(ref(db, 'Users/' + userName), { Username: userName, FirstName: firstName, LastName: lastName, Email: email })
            .catch((error) => {
                const errcode = error.code;
                const errmessage = error.message;
                console.log(errcode, errmessage);
            }));

    }
  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={{ width: 250, height: 250 }}
        source={require("./assets/logo.png")}
      />
      <Text style={globalStyles.heading}>Welcome!</Text>
      <TextInput
        placeholder="First name"
        onChangeText={(text) => setFirstName(text)}
        value={firstName}
        style={styles.textInput}
      />
      <TextInput
        placeholder="Last name"
        inputMode="text"
        onChangeText={(text) => setLastName(text)}
        value={lastName}
        style={styles.textInput}
      />
      <TextInput
        placeholder="Email"
        inputMode="text"
        onChangeText={(text) => setEmail(text)}
        value={email}
        style={styles.textInput}
      />
      <TextInput
        placeholder="Username"
        inputMode="text"
        onChangeText={(text) => setUsername(text)}
        value={username}
        style={styles.textInput}
      />
      <TextInput
        placeholder="Password"
        inputMode="text"
        onChangeText={(text) => setPassword(text)}
        value={password}
        style={styles.textInput}
      />
      <TextInput
        placeholder="Confirm password"
        inputMode="text"
        onChangeText={(text) => setConfirmPassword(text)}
        value={confirmPassword}
        style={styles.textInput}
      />
      <Pressable
        style={globalStyles.button}
        onPressOut={() => navigation.replace("main")} // Replace() stops the user from accidentaly swiping back to the signup or login screens
      >
        <Text style={globalStyles.buttonText}>Sign up</Text>
      </Pressable>
      {/* <Button title="Login" style={globalStyles.button} /> */}
      <View style={globalStyles.horizontalRule} />
      <Text style={{ fontSize: 20, color: "white", fontWeight: 500 }}>
        Already have an account?
      </Text>
      <Pressable
        style={globalStyles.button}
        onPressOut={() => createUser(email, password, username, firstName, lastName)}
      >
        <Text style={globalStyles.buttonText}>Log in</Text>
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
  heading: {
    fontSize: 30,
    color: "white",
    fontWeight: "600",
    fontFamily: "",
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
  hRule: {
    width: "90%",
    borderBottomColor: "white",
    borderBottomWidth: "1px",
  },
});
