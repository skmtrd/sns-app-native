import { ApiResponse, Assignment, DateComponents } from "@/constants/types";
import { CalendarTriggerInput } from "expo-notifications/build/Notifications.types";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchAssignment = async (): Promise<Assignment[]> => {
  try {
    const response = await fetch("https://iniad-sns.vercel.app/api/assignment");
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

export const convertDateFormat = (dateString: string): DateComponents => {
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
};

export const convertDateFormatBeforeOneHour = (
  dateString: string
): DateComponents => {
  const [datePart, timePart] = dateString.split("/");
  const [year, month, day] = datePart.split("-");
  const [hour, minute] = timePart.split(":");

  const date = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hour),
    parseInt(minute)
  );
  date.setHours(date.getHours() - 1);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
};

export const dayOnly = (dateString: string) => {
  const [datePart, timePart] = dateString.split("/");
  const [year, month, day] = datePart.split("-");
  const [hour, minute] = timePart.split(":");
  return day;
};

const setNotificationBeforeOneHour = async (assignment: Assignment) => {
  const trigger: CalendarTriggerInput = {
    ...convertDateFormatBeforeOneHour(assignment.deadLine),
    type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
  };

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "提出期限 1時間前の課題があります",
      body: assignment.title,
      data: { data: "データを追加できます" },
    },
    trigger,
  });

  return notificationId;
};

const setNotificationDayStart = async (assignment: Assignment) => {
  const trigger: CalendarTriggerInput = {
    ...convertDateFormat(assignment.deadLine),
    type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
  };

  trigger.hour = 0;
  trigger.minute = 0;

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "本日提出課題があります",
      body: assignment.title,
      data: { data: "データを追加できます" },
    },
    trigger,
  });

  return notificationId;
};

//通知をキャンセルする関数
export const cancelNotification = async (notificationId: string) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error("通知のキャンセルに失敗しました:", error);
  }
};

//保存ボタンを押した時の処理
export const handleSaveButton = async (assignment: Assignment) => {
  try {
    const savedAssignments = await AsyncStorage.getItem("savedAssignments");
    const parsedAssignments = savedAssignments
      ? JSON.parse(savedAssignments)
      : [];

    const isAlreadySaved = parsedAssignments.some(
      (saved: Assignment) => saved.id === assignment.id
    );

    let newAssignments;

    // 保存済みの場合
    if (isAlreadySaved) {
      newAssignments = parsedAssignments.filter(
        (saved: Assignment) => saved.id !== assignment.id
      );
      const notificationIds = await AsyncStorage.getItem(assignment.id);
      if (!notificationIds) throw new Error("Notification ID not found");
      for (const notificationId of notificationIds) {
        await cancelNotification(notificationId);
      }
      await AsyncStorage.removeItem(assignment.id);

      // 未保存の場合
    } else {
      newAssignments = [...parsedAssignments, assignment];
      const notificationId1 = await setNotificationBeforeOneHour(assignment);
      const notificationId2 = await setNotificationDayStart(assignment);
      await AsyncStorage.setItem(
        assignment.id,
        [notificationId1, notificationId2].join(",")
      );
    }

    await AsyncStorage.setItem(
      "savedAssignments",
      JSON.stringify(newAssignments)
    );
    return !isAlreadySaved;
  } catch (error) {
    console.error("Error handling assignment:", error);
    throw error;
  }
};
