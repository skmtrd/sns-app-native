import { Assignment } from "@/constants/types";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Folder, FolderOpen } from "lucide-react-native";
import { useState } from "react";
import * as Notifications from "expo-notifications";
import { CalendarTriggerInput } from "expo-notifications/build/Notifications.types";

type AssignmentCardProps = {
  item: Assignment;
  styles: any;
  alreadySaved: boolean;
  reload: () => void;
};

type DateComponents = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

function convertDateFormat(dateString: string): DateComponents {
  const [datePart, timePart] = dateString.split("/");
  const [year, month, day] = datePart.split("-");
  const [hour, minute] = timePart.split(":");

  return {
    year: parseInt(year),
    month: parseInt(month),
    day: parseInt(day),
    hour: parseInt(hour),
    minute: parseInt(minute),
  };
}

async function setNotification(assignment: Assignment) {
  const trigger: CalendarTriggerInput = {
    ...convertDateFormat(assignment.deadLine),
    type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
  };

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: assignment.title,
      body: assignment.description,
      data: { data: "データを追加できます" },
    },
    trigger,
  });

  return notificationId;
}

async function cancelNotification(notificationId: string) {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error("通知のキャンセルに失敗しました:", error);
  }
}

const handleSaveButton = async (assignment: Assignment) => {
  try {
    const savedAssignments = await AsyncStorage.getItem("savedAssignments");
    const parsedAssignments = savedAssignments
      ? JSON.parse(savedAssignments)
      : [];

    const isAlreadySaved = parsedAssignments.some(
      (saved: Assignment) => saved.id === assignment.id
    );

    let newAssignments;
    if (isAlreadySaved) {
      newAssignments = parsedAssignments.filter(
        (saved: Assignment) => saved.id !== assignment.id
      );
      const notificationId = await AsyncStorage.getItem(assignment.id);
      await cancelNotification(notificationId ?? "");
    } else {
      newAssignments = [...parsedAssignments, assignment];
      const notificationId = await setNotification(assignment);
      await AsyncStorage.setItem(assignment.id, notificationId);
    }

    await AsyncStorage.setItem(
      "savedAssignments",
      JSON.stringify(newAssignments)
    );
    return !isAlreadySaved;
  } catch (error) {
    console.error("Error handling assignment:", error);
    Toast.show({
      type: "error",
      text1: "エラーが発生しました",
    });
    throw error;
  }
};

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  item,
  styles,
  alreadySaved,
  reload,
}) => {
  const [isSaved, setIsSaved] = useState(alreadySaved);

  const handleRegister = async () => {
    try {
      const newSaveState = await handleSaveButton(item);
      setIsSaved(newSaveState);
    } catch (error) {
      console.error("Error in handleRegister:", error);
    } finally {
      reload();
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.9}>
      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.dueDate}>{item.deadLine}まで</Text>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            {isSaved ? (
              <Folder size={25} color="blue" fill="blue" />
            ) : (
              <FolderOpen size={25} color="blue" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AssignmentCard;
