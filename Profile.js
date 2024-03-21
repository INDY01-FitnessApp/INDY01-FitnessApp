import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import globalStyles from "./GlobalStyles";
/*
Username
Name
Email
Total distance traveled
Total exercise time
Completed trips
*/
export default function Profile() {
  const [username, setUsername] = useState("Username");
  const [firstName, setFirstName] = useState("Firstname");
  const [lastName, setLastName] = useState("Lastname");
  const [email, setEmail] = useState("Email");
  const [completedTrips, setCompletedTrips] = useState(0);
  const [exerciseTime, setExerciseTime] = useState(0);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  let profileAttrs = [
    { name: "Username", val: username },
    { name: "Name", val: `${firstName} ${lastName}` },
    { name: "E-mail", val: email },
  ].map((attr) => {
    return (
      <View style={styles.profileItem} key={attr.name}>
        <Text style={styles.profileItemName}>{attr.name}</Text>
        <Text style={styles.profileItemValue}>{attr.val}</Text>
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 10,
          gap: 20,
        }}
      >
        <Text style={globalStyles.heading}>Personal Information</Text>
        {profileAttrs}
        <View style={globalStyles.horizontalRule} />
        <Text style={globalStyles.heading}>Completed trips</Text>
        {completedTrips == 0 ? (
          <Text style={styles.profileItemName}>
            You have not completed any trips yet
          </Text>
        ) : (
          <Text style={styles.profileItemName}>
            Completed trips: {completedTrips}
          </Text>
        )}
        <View style={styles.profileItem}>
          <Text style={styles.profileItemName}>Total distance traveled</Text>
          <Text style={styles.profileItemValue}>
            {`${distanceTraveled.toFixed(1)} miles`}
          </Text>
        </View>
        <View style={styles.profileItem}>
          <Text style={styles.profileItemName}>Time spent exercising</Text>
          <Text style={styles.profileItemValue}>
            {/* This will probably change depending on the format that exercise time is stored in */}
            {`${exerciseTime}`}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: globalStyles.palette.backgroundDark,
  },
  profileItem: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
  },
  profileItemName: {
    color: "white",
    fontWeight: "500",
    fontSize: 20,
  },
  profileItemValue: {
    color: "white",
    fontSize: 20,
  },
});
