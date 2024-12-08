import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ViewBase,
} from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/ui/Header";
import { useTheme } from "@react-navigation/native";
import { Assignment } from "@/constants/types";
import AssignmentCard from "@/components/ui/AssignmentCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        await AsyncStorage.setItem("savedAssignments", JSON.stringify([]));
        const fetchedAssignments = await AsyncStorage.getItem(
          "savedAssignments"
        );
        console.log(fetchedAssignments);
        setAssignments(
          fetchedAssignments ? JSON.parse(fetchedAssignments) : []
        );
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred")
        );
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const reload = async () => {
    console.log("reload");
    const savedAssignmnets = await AsyncStorage.getItem("savedAssignments");
    console.log(savedAssignmnets);
  };

  const theme = useTheme();
  if (theme.dark) {
    return (
      <View style={darkStyles.container}>
        <View style={darkStyles.card}>
          <TouchableOpacity onPress={reload}>
            <Text style={darkStyles.buttonText}>リロード</Text>
          </TouchableOpacity>
        </View>
        <SafeAreaView>
          <Header title="課題一覧" />
          <ScrollView contentContainerStyle={darkStyles.scrollView}>
            {assignments.map((item) => (
              <AssignmentCard key={item.id} item={item} styles={darkStyles} />
            ))}
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  } else {
    return (
      <View style={lightStyles.container}>
        <SafeAreaView>
          <Header title="課題一覧" />
          <ScrollView contentContainerStyle={lightStyles.scrollView}>
            {assignments.map((item) => (
              <AssignmentCard key={item.id} item={item} styles={lightStyles} />
            ))}
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollView: {
    padding: 20,
    gap: 20,
  },
  card: {
    borderRadius: 15,
    padding: 20,
    backgroundColor: "#1c1c1e",
  },
  title: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#98989f",
    fontWeight: "semibold",
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  calendarIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  dueDate: {
    fontSize: 12,
    color: "#ff0000",
    fontWeight: "bold",
  },
  registerButton: {
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 5,
    marginLeft: "auto",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f7",
  },
  scrollView: {
    padding: 20,
    gap: 20,
  },
  card: {
    borderRadius: 15,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 15,
    color: "black",
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#8a8a8e",
    fontWeight: "semibold",
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  calendarIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  dueDate: {
    fontSize: 12,
    color: "#ff0000",
    fontWeight: "bold",
  },
  registerButton: {
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 5,
    marginLeft: "auto",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
