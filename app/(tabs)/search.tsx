import { View, TextInput, FlatList, StyleSheet, Text } from "react-native";
import { useState } from "react";

interface User {
  id: string;
  name: string;
  username: string;
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users] = useState<User[]>([
    { id: "1", name: "山田太郎", username: "@yamada" },
    { id: "2", name: "佐藤花子", username: "@sato" },
  ]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="ユーザーを検索..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userHandle}>{item.username}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchInput: {
    margin: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  userName: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  userHandle: {
    color: "#666",
  },
});
