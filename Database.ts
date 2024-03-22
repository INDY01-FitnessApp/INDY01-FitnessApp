import * as SQLite from 'expo-sqlite';
//create new row in Profile_Info table
export function insertProfileInfo(db, password, username, email, lastName, firstName) {
    const readOnly = true;
    db.transactionAsync(async tx => {
        await tx.executeSqlAsync('INSERT INTO User_Info (Password, Username, Email, Lastname, Firstname) VALUES (?, ?, ?, ?, ?)',
            [password, username, email, lastName, firstName],
            (txObj, resultSet) => this.setState({
                data: this.state.data.concat(
                    { Password: password, Username: username, Email: email, Lastname: lastName, Firstname: firstName })
            }),
            (txObj, error) => console.log('Error', error))
    })
}
//create new row in Distance_Traveled table
export function insertDistanceTraveled(db, password, totalDistance) {
    const readOnly = true;
    db.transactionAsync(async tx => {
        await tx.executeSqlAsync('INSERT INTO Distance_Traveled (Password, TotalDistance) VALUES (?, ?)',
            [password, totalDistance],
            (txObj, resultSet) => this.setState({
                data: this.state.data.concat(
                    { Password: password, TotalDistance: totalDistance })
            }),
            (txObj, error) => console.log('Error', error))
    })
}
//create the main database and its tables, only call once
export function insertCurrentTrip(db, password, currentDistance, tripsCompleted) {
    const readOnly = true;
    db.transactionAsync(async tx => {
        await tx.executeSqlAsync('INSERT INTO Current_Trip (Password, CurrentDistance, TripsCompleted) VALUES (?, ?, ?)',[password, currentDistance, tripsCompleted],
            (txObj, resultSet) => this.setState({
                data: this.state.data.concat(
                    { Password: password, CurrentDistance: currentDistance, TripsCompleted: tripsCompleted })
            }),
            (txObj, error) => console.log('Error', error))
    })
}

export function getData(db, password, table, column) {
/*return data from the database
parameters: 
            password => acts as 'user id' to search for current user's information

            table => the table from which to pull data
                Accepted params: 'Personal_Info', 'Distance_Traveled', 'Current_Trip'

            colmn => specify which column of data you want to query
                Accepted params: 'password', 'email', 'lastname', 'firstname', 'total_distance', 'trips_completed', 'current_distance',
                'all' => returns all columns for specified table
*/
    const readOnly = true;
    const result_array = [];
    const result = '';

    if (table == 'Personal_Info') {
        db.transactionAsync(async tx => {
            const result = await tx.executeSqlAsync(
                'SELECT Password, Username, Email, Lastname, Firstname FROM User_Info WHERE Password = ?', [password]);
            if (column == 'all') {
                result_array[0] = result.rows[0]['Password']
                result_array[1] = result.rows[0]['Username']
                result_array[2] = result.rows[0]['Email']
                result_array[3] = result.rows[0]['Lastname']
                result_array[4] = result.rows[0]['Firstname']
            }
            else if (column == 'password') {
                result_array[0] = result.rows[0]['Password']
            }
            else if (column == 'username') {
                result_array[0] = result.rows[0]['Username']
            }
            else if (column == 'email') {
                result_array[0] = result.rows[0]['Email']
            }
            else if (column == 'lastname') {
                result_array[0] = result.rows[0]['LastName']
            }
            else if (column == 'firstname') {
                result_array[0] = result.rows[0]['firstname']
            }
        }, readOnly);
        return result_array;
    }

    else if (table == 'Distance_Traveled') {
        db.transactionAsync(async tx => {
            const result = await tx.executeSqlAsync(
                'SELECT Password, TotalDistance FROM Distance_Traveled WHERE Password = ?', [password]);
            if (column == 'all') { 
                result_array[0] = result.rows[0]['Password']
                result_array[1] = result.rows[0]['TotalDistance']
            }
            else if (column == 'password') {
                result_array[0] = result.rows[0]['Password']
            }
            else if (column == 'total_distance') {
                result_array[0] = result.rows[0]['TotalDistance']
            }
            
        }, readOnly);
        return result_array;
    }
    else if (table == 'Current_Trip') {
        db.transactionAsync(async tx => {
            const result = await tx.executeSqlAsync(
                'SELECT Password, CurrentDistance, TripsCompleted FROM Current_Trip WHERE Password = ?', [password]);
            if (column == 'all') {
                result_array[0] = result.rows[0]['Password']
                result_array[1] = result.rows[0]['CurrentDistance']
                result_array[2] = result.rows[0]['TripsCompleted']
            }
            else if (column == 'password') {
                result_array[0] = result.rows[0]['Password']
            }
            else if (column == 'current_distance') {
                result_array[0] = result.rows[0]['CurrentDistance']
            }
            else if (column == 'trips_completed') {
                result_array[0] = result.rows[0]['TripsCompleted']
            }
        }, readOnly);
        return result_array;
    }   
}
//update Distance_Traveled table
export function updateDistanceTraveled(db, password, totalDistance) {
    db.transactionAsync(async tx => {
        await tx.executeSqlAsync('UPDATE Distance_Traveled SET TotalDistance = TotalDistance + (?) WHERE Password = (?)',
            [totalDistance, password]),
            (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                    let newList = this.state.data.map(data => {
                        if (data.TotalDistance === totalDistance) {
                            return { ...data, TotalDistance: data.TotalDistance + totalDistance }
                        }
                        else {
                            return data;
                        }
                    })
                    this.setState({ data: newList })
                }
            }
    })
}
//update Current_Distance table
export function updateCurrentDistance(db, password, currentDistance, tripsCompleted) {
    //if the number of trips completed is updated, set current distance to zero
    if (tripsCompleted > 0) {
        db.transactionAsync(async tx => {
            await tx.executeSqlAsync('UPDATE Current_Trip SET CurrentDistance = CurrentDistance - CurrentDistance, TripsCompleted = TripsCompleted + (?) WHERE Password = (?)',
                [tripsCompleted, password]),
                (txObj, resultSet) => {
                    if (resultSet.rowsAffected > 0) {
                        let newList = this.state.data.map(data => {
                            if (data.CurrentDistance === currentDistance && data.TripsCompleted === tripsCompleted) {
                                return { ...data, CurrentDistance: data.CurrentDistance - data.CurrentDistance, TripsCompleted: data.TripsCompleted + tripsCompleted }
                            }
                            else {
                                return data;
                            }
                        })
                        this.setState({ data: newList })
                    }
                }
        })
    }
    else {
        db.transactionAsync(async tx => {
            await tx.executeSqlAsync('UPDATE Current_Trip SET CurrentDistance = CurrentDistance + (?), TripsCompleted = TripsCompleted + (?) WHERE Password = (?)',
                [currentDistance, tripsCompleted, password]),
                (txObj, resultSet) => {
                    if (resultSet.rowsAffected > 0) {
                        let newList = this.state.data.map(data => {
                            if (data.CurrentDistance === currentDistance && data.TripsCompleted === tripsCompleted) {
                                return { ...data, CurrentDistance: data.CurrentDistance + currentDistance, TripsCompleted: data.TripsCompleted + tripsCompleted }
                            }
                            else {
                                return data;
                            }
                        })
                        this.setState({ data: newList })
                    }
                }
        })
    }
}
