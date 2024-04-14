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
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { app, auth, db } from "./firebaseConfig.js";
import {
  getDatabase,
  ref,
  get,
  set,
  child,
  push,
  update,
  onValue,
} from "firebase/database";
import { startNewTrip } from "./DatabaseFunctions.js";

/*const u = 'robby';
const newKey = push(child(ref(db), 'Users')).key;
const updates = {};
updates['Users/test/LastName'] = u;
update(ref(db), updates);
/*
set(ref(db, 'Users/' + 'test'), {
    Username: 'im test',
    FirstName: 'te',
    LastName: 'st',
    totalDistanace: 69.69,
    tripsCompleted: 10
});

const userRef = ref(db, 'Users/' + '/mbolnik25' + '/Email');
onValue(userRef, (snapshot) => {
    const data = snapshot.val();
    console.log(data);
})*/

// TODO: Add error messages
export default function SignupPage({ navigation }) {
  const [username, setUsername] = useState("LukeZeches");
  const [password, setPassword] = useState("123456");
  const [confirmPassword, setConfirmPassword] = useState("123456");
  const [firstName, setFirstName] = useState("Luke");
  const [lastName, setLastName] = useState("Zeches");
  const [email, setEmail] = useState("zechesl@gmail.com");

  //allows for the creation of a new user
  async function createUser(email, password, userName, firstName, lastName) {
    //create a new user with email and password info
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      //get user id
      const id = auth.currentUser.uid;

      await set(ref(db, "Users/" + id), {
        Username: userName,
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        totalDistanace: 0.0,
        tripsCompleted: 0,
        exerciseTime: 0.0,
      });
      startNewTrip(id, "none", "", [0, 0], "", [0, 0], 0, {});
      await set(ref(db, "CompletedTrips/" + id), {});
      navigation.replace("login");
    } catch (error) {
      const errcode = error.code;
      const errmessage = error.message;
      console.log(errcode, errmessage);
    }
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
        onPressOut={() =>
          createUser(email, password, username, firstName, lastName)
        }
      >
        <Text style={globalStyles.buttonText}>Create account</Text>
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
