import { View, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

const Header = () => {
  return (
    <ThemedView style={styles.header}>
      <ThemedText type="title">Home</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 10,
  },
});

export default Header;
