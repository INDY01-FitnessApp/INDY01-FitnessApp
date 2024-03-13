import { StyleSheet } from "react-native";

// style={[globalStyles.heading, {color: "black" }]}
// This syntax lets you override properties of the global styles. For example, this applies the global heading style, but changes the color to black
const globalStyles = StyleSheet.create({
  button: {
    backgroundColor: "#ff950f",
    borderWidth: 1,
    borderColor: "black",
    minWidth: 125,
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 30,
    color: "white",
    fontWeight: "600",
    fontFamily: "",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    textAlignVertical: "center",
  },
  horizontalRule: {
    width: "90%",
    borderBottomColor: "white",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  palette: {
    backgroundDark: "#262626",
  },
});

export default globalStyles;
