import { View, Text, TouchableOpacity, Linking } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TimeIntervalTriggerInput } from "expo-notifications/build/Notifications.types";
import * as Notifications from "expo-notifications";
import { useNavigation } from "expo-router";
import { CalendarTriggerInput } from "expo-notifications/build/Notifications.types";

const trigger: CalendarTriggerInput = {
  year: 2024,
  month: 12,
  day: 9,
  hour: 16,
  minute: 44,
  type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
};

// 通知をスケジュールする関数
async function scheduleHourlyNotification(title: string, body: string) {
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      data: { data: "データを追加できます" },
    },
    trigger,
  });

  return notificationId; // 後でキャンセルできるようにIDを返す
}

async function cancelNotification(notificationId: string) {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log("通知がキャンセルされました");
  } catch (error) {
    console.error("通知のキャンセルに失敗しました:", error);
  }
}

export default function HomeScreen() {
  const [activeNotificationId, setActiveNotificationId] = useState<string[]>(
    []
  );
  const navigation = useNavigation();

  const startNotification = async () => {
    const id = await scheduleHourlyNotification("dsa", "1時間ごとの通知です");
    setActiveNotificationId([...activeNotificationId, id]);
  };

  const stopNotification = async () => {
    if (activeNotificationId) {
      for (const id of activeNotificationId) {
        await cancelNotification(id);
      }
      setActiveNotificationId([]);
    }
  };

  const handlePress = async () => {
    const url = "https://x.com";
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`このURLは開けません: ${url}`);
    }
  };

  return (
    <View>
      <SafeAreaView>
        <TouchableOpacity onPress={handlePress}>
          <Text style={{ color: "blue", textDecorationLine: "underline" }}>
            他の画面へ移動
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={startNotification}>
          <Text>通知</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={stopNotification}>
          <Text>キャンセル</Text>
        </TouchableOpacity>
        {
          // 通知のIDを表示
          activeNotificationId.map((id) => {
            return <Text key={id}>{id}</Text>;
          })
        }
      </SafeAreaView>
    </View>
  );
}
