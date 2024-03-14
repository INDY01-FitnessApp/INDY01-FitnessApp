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
export default function LoginPage({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={{ width: 250, height: 250 }}
        source={require("./assets/logo.png")}
      />
      <Text style={globalStyles.heading}>Welcome!</Text>
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
      <Pressable
        style={globalStyles.button}
        onPressOut={() => navigation.replace("main")} // Replace() stops the user from accidentaly swiping back to the signup or login screens
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
