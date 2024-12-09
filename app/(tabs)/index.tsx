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
import { ApiResponse, Assignment } from "@/constants/types";
import AssignmentCard from "@/components/ui/AssignmentCard";
import { fetchAssignment } from "../utils/functions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Folder } from "lucide-react-native";
import {
  type NotificationContentInput,
  type TimeIntervalTriggerInput,
} from "expo-notifications";
import HeaderTab from "@/components/ui/HeaderTab";

const trigger: TimeIntervalTriggerInput = {
  seconds: 5,
  type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
};
async function sendImmediateNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      data: { data: "データを追加できます" },
    },
    trigger,
  });
}

export default function HomeScreen() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [savedAssignments, setSavedAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedTab, setSelectedTab] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedAssignments = await fetchAssignment();
        setAssignments(fetchedAssignments);
        const savedAssignmnets = await AsyncStorage.getItem("savedAssignments");
        setSavedAssignments(
          savedAssignmnets ? JSON.parse(savedAssignmnets) : []
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
    const savedAssignmnets = await AsyncStorage.getItem("savedAssignments");
    setSavedAssignments(savedAssignmnets ? JSON.parse(savedAssignmnets) : []);
  };

  const clear = async () => {
    console.log("clear");
    await AsyncStorage.setItem("savedAssignments", JSON.stringify([]));
  };

  const handleToggleTab = (boolean: boolean) => {
    setSelectedTab(boolean);
    reload();
  };

  const theme = useTheme();
  if (theme.dark) {
    return (
      <View style={darkStyles.container}>
        <SafeAreaView>
          <Header title="課題一覧" />
          <HeaderTab
            selectedTab={selectedTab}
            handleToggleTab={handleToggleTab}
            styles={darkStyles}
          />
          <ScrollView contentContainerStyle={darkStyles.scrollView}>
            {selectedTab
              ? assignments.map((item) => (
                  <AssignmentCard
                    key={item.id}
                    item={item}
                    styles={darkStyles}
                    alreadySaved={
                      savedAssignments.filter((saved) => saved.id === item.id)
                        .length > 0
                    }
                    reload={reload}
                  />
                ))
              : savedAssignments.map((item) => (
                  <AssignmentCard
                    key={item.id}
                    item={item}
                    styles={darkStyles}
                    alreadySaved={
                      savedAssignments.filter((saved) => saved.id === item.id)
                        .length > 0
                    }
                    reload={reload}
                  />
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
          <HeaderTab
            selectedTab={selectedTab}
            handleToggleTab={handleToggleTab}
            styles={lightStyles}
          />
          <ScrollView contentContainerStyle={lightStyles.scrollView}>
            {selectedTab
              ? assignments.map((item) => (
                  <AssignmentCard
                    key={item.id}
                    item={item}
                    styles={lightStyles}
                    alreadySaved={
                      savedAssignments.filter((saved) => saved.id === item.id)
                        .length > 0
                    }
                    reload={reload}
                  />
                ))
              : savedAssignments.map((item) => (
                  <AssignmentCard
                    key={item.id}
                    item={item}
                    styles={lightStyles}
                    alreadySaved={
                      savedAssignments.filter((saved) => saved.id === item.id)
                        .length > 0
                    }
                    reload={reload}
                  />
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
  headerTab: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  headerTabItem: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomColor: "#0000ff",
    borderBottomWidth: 2,
  },
  headerTabText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  scrollView: {
    padding: 20,
    gap: 20,
  },
  card: {
    borderRadius: 15,
    padding: 25,
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
    alignItems: "flex-end",
    justifyContent: "space-between",
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
    borderRadius: 5,
  },
});

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f7",
  },
  headerTab: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  headerTabItem: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomColor: "#0000ff",
    borderBottomWidth: 2,
  },
  headerTabText: {
    fontSize: 20,
    color: "#000000",
    fontWeight: "bold",
  },
  scrollView: {
    padding: 20,
    gap: 20,
  },
  card: {
    borderRadius: 15,
    padding: 25,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 15,
    color: "#000",
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
    alignItems: "flex-end",
    justifyContent: "space-between",
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
    borderRadius: 5,
  },
});

// const lightStyles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f2f2f7",
//   },
//   scrollView: {
//     padding: 20,
//     gap: 20,
//   },
//   card: {
//     borderRadius: 15,
//     padding: 20,
//     backgroundColor: "#ffffff",
//   },
//   title: {
//     fontSize: 15,
//     color: "black",
//     fontWeight: "bold",
//     marginBottom: 8,
//   },
//   description: {
//     fontSize: 14,
//     color: "#8a8a8e",
//     fontWeight: "semibold",
//     marginBottom: 8,
//   },
//   cardFooter: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   calendarIcon: {
//     fontSize: 16,
//     marginRight: 4,
//   },
//   dueDate: {
//     fontSize: 12,
//     color: "#ff0000",
//     fontWeight: "bold",
//   },
//   registerButton: {
//     padding: 8,
//     borderRadius: 5,
//     marginLeft: "auto",
//   },
// });
