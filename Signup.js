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
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';
import { useEffect } from 'react';
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry"
import { insertProfileInfo, insertDistanceTraveled, insertCurrentTrip, getData, updateDistanceTraveled, updateCurrentDistance } from "./Database.ts"

const db = SQLite.openDatabase('User_Information.db');
//db.closeAsync();
//db.deleteAsync();

export function fetch(password) {
    //create table for  storing user's basic information
    const db = SQLite.openDatabase('User_Information.db');
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS User_Info(Password TEXT PRIMARY KEY, Username TEXT NOT NULL UNIQUE, Email TEXT NOT NULL, Lastname TEXT NOT NULL, Firstname TEXT)'
        )
    })

    //create table for storing user's total distance and number of trips completed
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS Distance_Traveled(Password TEXT PRIMARY KEY NOT NULL, TotalDistance REAL)'
        )
    })
    //create table for storing user's distance on the current trip
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS Current_Trip(Password TEXT PRIMARY KEY NOT NULL, CurrentDistance REAL, TripsCompleted INT)'
        )
    })

    const result1 = getData(db, password, 'Personal_Info', 'all');
    const result2 = getData(db, password, 'Distance_Traveled', 'all');
    const result3 = getData(db, password, 'Current_Trip', 'all');
    console.log(result1);
    console.log(result2);
    console.log(result3);
}
export function helper(password) {
    useEffect(() => {
        fetch(password);
    }, [db]);
}
export default function SignupPage({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  function createProfile(password, username, email, last, first) {

        const db = SQLite.openDatabase('User_Information.db');
        //create table for  storing user's basic information
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS User_Info(Password TEXT PRIMARY KEY, Username TEXT NOT NULL UNIQUE, Email TEXT NOT NULL, Lastname TEXT NOT NULL, Firstname TEXT)'
            )
        })

        //create table for storing user's total distance and number of trips completed
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS Distance_Traveled(Password TEXT PRIMARY KEY NOT NULL, TotalDistance REAL)'
            )
        })
        //create table for storing user's distance on the current trip
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS Current_Trip(Password TEXT PRIMARY KEY NOT NULL, CurrentDistance REAL, TripsCompleted INT)'
            )
        })

        //add user input into the datbase
        insertProfileInfo(db, password, username, email, last, first);

        //set total distance to zero
        insertDistanceTraveled(db, password, 0.0);

        //set current trips to zero
        insertCurrentTrip(db, password, 0, 0);

        navigation.replace("main")
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
              onPressOut={() => createProfile(password, username, email, lastName, firstName)} // Replace() stops the user from accidentaly swiping back to the signup or login screens
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
