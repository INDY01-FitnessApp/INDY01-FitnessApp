import { StyleSheet, SafeAreaView, Text } from "react-native";

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Home</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "dodgerblue",
    alignItems: "center",
    justifyContent: "center",
  },
});
