import { useState } from "react";
import {
    Pressable,
    SafeAreaView,
    StyleSheet,
    TextInput,
    Text,
    View,
} from "react-native";
import globalStyles from "./GlobalStyles";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "./firebaseConfig.js";
export default function Reset_Password({ navigation }) {
    const [email, setEmail] = useState("");
    function resetPasswordEmail(email) {
        sendPasswordResetEmail(auth, email).then(() => {
            console.log('Email sent');
        })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log('error');
            });
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={globalStyles.heading}>Enter Password</Text>
            <TextInput
                placeholder="Email"
                inputMode="text"
                onChangeText={(text) => setEmail(text)}
                value={email}
                style={styles.textInput}
            />
            <Pressable
                style={globalStyles.button}
                onPressOut={() => resetPasswordEmail(email)}
            >
                <Text style={globalStyles.buttonText}>Send Email</Text>
            </Pressable>
            <Pressable
                style={globalStyles.button}
                onPressOut={() => navigation.navigate("login")}
            >
                <Text style={globalStyles.buttonText}>Return to Login</Text>
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
            justifyContent: "center",
            alignItems: "center",
            gap: "20px"
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

