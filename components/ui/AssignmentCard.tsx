import { Assignment } from "@/constants/types";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AssignmentCardProps = {
  item: Assignment;
  styles: any;
};

const registerAssignment = async (assignment: Assignment) => {
  try {
    const savedAssignments = await AsyncStorage.getItem("savedAssignments");
    const parsedAssignments = savedAssignments
      ? JSON.parse(savedAssignments)
      : [];
    const willSaveAssignments = JSON.stringify([
      ...parsedAssignments,
      assignment,
    ]);
    await AsyncStorage.setItem("savedAssignments", willSaveAssignments);
  } catch (error) {
    console.error("Error registering assignment:", error);
    throw error;
  }
};

const AssignmentCard: React.FC<AssignmentCardProps> = ({ item, styles }) => {
  const handleRegister = () => {
    registerAssignment(item);
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
            <Text style={styles.buttonText}>登録する</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AssignmentCard;
