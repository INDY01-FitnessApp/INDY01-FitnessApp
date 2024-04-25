import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import globalStyles from "./GlobalStyles";
import { app, auth, db } from './firebaseConfig.js';
import { getDatabase, ref, get} from "firebase/database"
/*
Username
Name
Email
Total distance traveled
Total exercise time
Completed trips
*/

async function getUserInfo(user_id) {
    const userRef = ref(db, 'Users/' + '/' + user_id);
    const snapshot = await get(userRef);
    const data = (snapshot.val());
    return data;
}
export default function Profile() {
  const user = auth.currentUser;
  const id = user.uid;
  let userInfo;

  //const userEmail = await getUserInfo(id);
  const [username, setUsername] = useState("HootyHoo");
  const [firstName, setFirstName] = useState('hooty');
  const [lastName, setLastName] = useState("The Owl");
  const [email, setEmail] = useState('temp');
  const [completedTrips, setCompletedTrips] = useState(0);
  const [exerciseTime, setExerciseTime] = useState(1.2);
  const [distanceTraveled, setDistanceTraveled] = useState(3.4);

  // TODO: this runs 5 times???
   getUserInfo(id).then(res => {
       userInfo = res;
       console.log('User is: ', userInfo);
       setEmail(userInfo.Email);
       setFirstName(userInfo.FirstName);
       setLastName(userInfo.LastName);
       setUsername(userInfo.Username);
       setDistanceTraveled(userInfo.totalDistance);
    });
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
            {`${exerciseTime} hrs`}
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
