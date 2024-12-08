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

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Header from "@/components/ui/Header";
import { useTheme } from "@react-navigation/native";

type DateString = string; // ISO 8601形式 "YYYY-MM-DDTHH:mm:ss.sssZ"
type DeadlineString = string; // "YYYY-MM-DD/HH:mm" 形式

type CurrentSession = {
  currentDateTime: DateString;
  currentUserLogin: string;
};

type Assignment = {
  id: string;
  title: string;
  description: string;
  deadLine: DeadlineString;
  imageUrl: string | null;
  authorId: string;
  createdAt: DateString;
  updatedAt: DateString;
  replies: Reply[];
  likes: Like[];
  author: User;
};

type Like = {
  id: string;
  userId: string;
  postId: string | null;
  assignmentId: string;
  questionId: string | null;
  createdAt: DateString;
  updatedAt: DateString;
  user: User;
};

type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: string | null;
  image: string;
  introduction: string | null;
  iconUrl: string | null;
  createdAt: DateString;
  updatedAt: DateString;
  tags?: Tag[];
};

type Tag = {
  id: string;
  name: string;
  createdAt: DateString;
  updatedAt: DateString;
};

type Reply = {
  id: string;
  content: string;
  authorId: string;
  assignmentId: string;
  createdAt: DateString;
  updatedAt: DateString;
};

type ApiResponse = {
  message: string;
  data: Assignment[];
};

export default function HomeScreen() {
  // fetch関数
  const fetchAssignment = async (): Promise<Assignment[]> => {
    try {
      const response = await fetch(
        "https://iniad-sns.vercel.app/api/assignment"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: ApiResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  };

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedAssignments = await fetchAssignment();
        setAssignments(fetchedAssignments);
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

  const AssignmentCard = (item: Assignment, styles: any) => (
    <TouchableOpacity key={item.id} activeOpacity={0.9}>
      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.dueDate}>{item.deadLine}まで</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const theme = useTheme();
  if (theme.dark) {
    return (
      <View style={darkStyles.container}>
        <SafeAreaView>
          <Header title="課題一覧" />
          <ScrollView contentContainerStyle={darkStyles.scrollView}>
            {assignments.map((item) => AssignmentCard(item, darkStyles))}
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
            {assignments.map((item) => AssignmentCard(item, lightStyles))}
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
});
