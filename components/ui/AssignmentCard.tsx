import { Assignment } from "@/constants/types";
import { TouchableOpacity, View, Text } from "react-native";
import { Folder, FolderOpen } from "lucide-react-native";
import { useState } from "react";
import { handleSaveButton } from "@/app/utils/functions";
type AssignmentCardProps = {
  item: Assignment;
  styles: any;
  alreadySaved: boolean;
  reload: () => void;
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
