import { View, Text, TouchableOpacity, Linking } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TimeIntervalTriggerInput } from "expo-notifications/build/Notifications.types";
import * as Notifications from "expo-notifications";
import { useNavigation } from "expo-router";
import { CalendarTriggerInput } from "expo-notifications/build/Notifications.types";

// 通知をスケジュールする関数
async function scheduleHourlyNotification(title: string, body: string) {
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
      </SafeAreaView>
    </View>
  );
}
