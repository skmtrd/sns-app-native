import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
type Props = {
  handleToggleTab: (value: boolean) => void;
  selectedTab: boolean;
  styles: any;
};

const HeaderTab: React.FC<Props> = ({
  handleToggleTab,
  selectedTab,
  styles,
}) => {
  return (
    <View style={styles.headerTab}>
      <TouchableOpacity onPress={() => handleToggleTab(true)}>
        <View
          style={[
            styles.headerTabItem,
            {
              borderBottomColor: "#0000f7",
              borderBottomWidth: selectedTab ? 2 : 0,
            },
          ]}
        >
          <Text style={styles.headerTabText}>課題一覧</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleToggleTab(false)}>
        <View
          style={[
            styles.headerTabItem,
            {
              borderBottomColor: "#0000f7",
              borderBottomWidth: selectedTab ? 0 : 2,
            },
          ]}
        >
          <Text style={styles.headerTabText}>登録済み</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default HeaderTab;
