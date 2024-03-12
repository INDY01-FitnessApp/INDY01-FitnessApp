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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={{ width: 250, height: 250 }}
        source={require("./assets/logo.png")}
      />
      <Text style={styles.heading}>Welcome!</Text>
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
        onPressOut={() => navigation.navigate("home")}
      >
        <Text style={globalStyles.buttonText}>Sign up</Text>
      </Pressable>
      {/* <Button title="Login" style={globalStyles.button} /> */}
      <View style={styles.hRule} />
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
