import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import globalStyles from "./GlobalStyles";
import { app, auth, db } from "./firebaseConfig.js";
import { getDatabase, ref, get } from "firebase/database";
import * as dbFunction from "./DatabaseFunctions.js";
/*
Username
Name
Email
Total distance traveled
Total exercise time
Completed trips
*/

async function getUserInfo(user_id) {
  const userRef = ref(db, "Users/" + "/" + user_id);
  const snapshot = await get(userRef);
  const data = snapshot.val();
  return data;
}
export default function Profile() {
  const [user, setUser] = useState(null);
  // TODO: this runs 5 times???
  useEffect(() => {
    getUserInfo(id).then((res) => {
      setUser(res);
    });
  }, []);

  let profileAttrs = [
    { name: "Username", val: user.Username },
    { name: "Name", val: `${userInfo.FirstName} ${user.LastName}` },
    { name: "E-mail", val: user.Email },
  ].map((attr) => {
    return (
      <View style={styles.profileItem} key={attr.name}>
        <Text style={styles.profileItemName}>{attr.name}</Text>
        <Text style={styles.profileItemValue}>{attr.val}</Text>
      </View>
    );
  });

  function msToTimeString(ms) {
    sec = ms / 1000;
    min = Math.floor(sec / 60);
    hr = Math.floor(min / 60);
    minRemaining = min % 60;
    hrStr = hr.toString().padStart(2, "0");
    minStr = minRemaining.toString().padStart(2, "0");
    return `${hrStr}:${minStr}`;
  }
  return (
    <SafeAreaView style={styles.container}>
      {1 == 2 ? (
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
          {user.tripsCompleted == 0 ? (
            <Text style={styles.profileItemName}>
              You have not completed any trips yet
            </Text>
          ) : (
            <Text style={styles.profileItemName}>
              Completed trips: {user.completedTrips}
            </Text>
          )}
          <View style={styles.profileItem}>
            <Text style={styles.profileItemName}>Total distance traveled</Text>
            <Text style={styles.profileItemValue}>
              {`${user.totalDistance.toFixed(1)} miles`}
            </Text>
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.profileItemName}>Time spent exercising</Text>
            <Text style={styles.profileItemValue}>
              {/* This will probably change depending on the format that exercise time is stored in */}
              {`${msToTimeString(totalDistance.exerciseTime)}`}
            </Text>
          </View>
        </View>
      ) : (
        <View></View>
      )}
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
