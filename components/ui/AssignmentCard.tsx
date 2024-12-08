import { Assignment } from "@/constants/types";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Folder, FolderOpen } from "lucide-react-native";
import { useState } from "react";
type AssignmentCardProps = {
  item: Assignment;
  styles: any;
  alreadySaved: boolean;
  reload: () => void;
};

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
      Toast.show({
        type: "success",
        text1: "課題を削除しました",
      });
    } else {
      newAssignments = [...parsedAssignments, assignment];
      Toast.show({
        type: "success",
        text1: "課題を保存しました",
      });
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
