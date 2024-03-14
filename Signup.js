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
export default function SignupPage({ navigation }) {
  const [username, setUsername] = useState("FirstName");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

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
        style={styles.textInput}
      />
      <TextInput
        placeholder="Email"
        inputMode="text"
        style={styles.textInput}
      />
      <TextInput
        placeholder="Username"
        inputMode="text"
        style={styles.textInput}
      />
      <TextInput
        placeholder="Password"
        inputMode="text"
        style={styles.textInput}
      />
      <TextInput
        placeholder="Confirm password"
        inputMode="text"
        style={styles.textInput}
      />
      <Pressable
        style={globalStyles.button}
        onPressOut={() => {
          console.log(firstName);
          navigation.replace("home");
        }} // Replace() stops the user from accidentaly swiping back to the signup or login screens
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
        onPressOut={() => navigation.navigate("login")}
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
