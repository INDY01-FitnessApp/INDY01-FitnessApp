import { useState } from "react";
import {
  Button,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
} from "react-native";
import globalStyles from "./GlobalStyles";
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
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
      <Pressable style={globalStyles.button}>
        <Text style={{ color: "dodgerblue" }}>Login</Text>
      </Pressable>
      <Button title="Login" style={globalStyles.button} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexGrow: 1,
    backgroundColor: "#e5e6ff",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  textInput: {
    width: "75%",
    height: 40,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
});
