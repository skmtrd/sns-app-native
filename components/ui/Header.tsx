import { useTheme } from "@react-navigation/native";
import { View, StyleSheet, Text } from "react-native";

const Header = ({ title }: { title: string }) => {
  const theme = useTheme();

  if (theme.dark) {
    return (
      <View style={darkStyles.header}>
        <Text style={darkStyles.text}>{title}</Text>
      </View>
    );
  } else {
    return (
      <View style={lightStyles.header}>
        <Text style={lightStyles.text}>{title}</Text>
      </View>
    );
  }
};

const darkStyles = StyleSheet.create({
  header: {
    padding: 25,
  },
  text: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
});

const lightStyles = StyleSheet.create({
  header: {
    padding: 25,
  },
  text: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
  },
});

export default Header;
