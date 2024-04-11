import { app, auth, db } from './firebaseConfig.js';
import { getDatabase, ref, get, set, child, push, update, onValue, orderByChild } from "firebase/database"

//returns list of all user info
export async function getUserInfo(user_id) {
    const userRef = ref(db, 'Users/' + '/' + user_id);
    const snapshot = await get(userRef);
    const data = (snapshot.val());
    return data;
}

//returns list of current trip info
export async function getCurrentTrip(user_id) {
    const userRef = ref(db, 'CurrentTrips/' + '/' + user_id);
    const snapshot = await get(userRef);
    const data = (snapshot.val());
    return data;
}

//returns a list of all completed trips
//TO DO: check if you can get info from each trip
export async function getCompletedTrips(user_id) {
    const userRef = ref(db, 'CompletedTrips/' + '/' + user_id);
    const snapshot = await get(userRef);
    const data = (snapshot.val());
    return data;
}

//use when done exercising, updates the total distance/time of the user
export function updateUserInfo(user_id, distance, time) {
    let userInfo;
    //get the previous distance and time
    getUserInfo(user_id).then(response => {
        userInfo = response;
        //add new values
        const updatedDistance = userInfo.totalDistance + distance;
        const updatedTime = userInfo.exerciseTime + time;

        //update distance
        const distanceUpdates = {};
        distanceUpdates['Users/' + user_id + '/totalDistance'] = updatedDistance;
        update(ref(db), distanceUpdates);

        //update time
        const timeUpdates = {};
        timeUpdates['Users/' + user_id + '/exerciseTime'] = updatedTime;
        update(ref(db), timeUpdates);
    })
}

//use when done exercising, updates the total distance/time of the current trip
export function updateCurrentTrip(user_id, distance, time) {
    let currentTrip;
    //get the previous distance and time
    getCurrentTrip(user_id).then(response => {
        currentTrip = response;
        //add new values
        const updatedDistance = currentTrip.currentDistance + distance;
        const updatedTime = currentTrip.time + time;

        //update distance
        const distanceUpdates = {};
        distanceUpdates['CurrentTrips/' + user_id + '/totalDistance'] = updatedDistance;
        update(ref(db), distanceUpdates);

        //update time
        const timeUpdates = {};
        timeUpdates['CurrentTrips/' + user_id + '/exerciseTime'] = updatedTime;
        update(ref(db), timeUpdates);
    })
}
//starts a new trip
export function startNewTrip(user_id, tripName, origin_name, originCoords, destination_name, destinationCoords, totalDistance) {
    const freshTrips = {
        currentDistance: 0.0,
        currentTrip: tripName,
        orign: originCoords,
        originName: origin_name,
        destination: destinationCoords,
        destinationName: destination_name,
        totalDistance: totalDistance,
        time: 0.0
    }
    const updates = {};
    updates['CurrentTrips/' + user_id] = freshTrips;
    update(ref(db), updates);
}

//clears the info of the current trip
//don't know if you'll need this but its here anyway 8==D
export function clearTrip(user_id) {
    const clear = {
        currentDistance: 0.0,
        currentTrip: 'none',
        orign: [0, 0],
        originName: '',
        destination: [0, 0],
        destinationName: '',
        totalDistance: 0,
        time: 0.0
    }
    const updates = {};
    updates['CurrentTrips/' + user_id] = clear;
    update(ref(db), updates);
}

//adds a completed trip to the database
export function addCompletedTrip(user_id, tripName, origin_name, originCoords, destination_name, destinationCoords, totalDistance, time) {
    const completedTrip = {
        distance: totalDistance,
        totalTime: time,
        origin: originCoords,
        originName: origin_name,
        destination: destinationCoords,
        destinationName: destination_name,
    }
    const updates = {};
    updates['CompletedTrips/' + user_id + '/' + tripName] = completedTrip;
    update(ref(db), updates);
}

//call when a trip is completed, increments tripCompleted counter by 1
export function addTripsCompleted(user_id) {
    let userInfo;
    //get user info
    getUserInfo(user_id).then(response => {
        userInfo = response;
        //increment tripsCompleted by 1
        const totalTripsCompleted = userInfo.tripsCompleted + 1;

        //update the value
        updates['Users/' + user_id + '/tripsCompleted'] = totalTripsCompleted;
        update(ref(db), updates);
    })
}



