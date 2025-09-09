import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, router } from "expo-router";
import { ArrowLeft, Bell, Clock } from "lucide-react-native";
import { useSettings } from "@/providers/SettingsProvider";

export default function NotificationsScreen() {
  const { settings, updateNotificationSettings, currentTheme } = useSettings();
  const [reminderTime, setReminderTime] = useState(settings.notifications.reminderTime);

  const handleToggle = async (key: keyof typeof settings.notifications, value: boolean) => {
    await updateNotificationSettings({ [key]: value });
  };

  const handleTimeChange = () => {
    if (Platform.OS === "web") {
      const time = prompt("Enter time (HH:MM format):", reminderTime);
      if (time && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
        setReminderTime(time);
        updateNotificationSettings({ reminderTime: time });
      } else if (time) {
        Alert.alert("Invalid Time", "Please enter time in HH:MM format (e.g., 09:30)");
      }
    } else {
      Alert.alert(
        "Set Reminder Time",
        "Choose your preferred meditation reminder time:",
        [
          { text: "9:00 AM", onPress: () => updateTime("09:00") },
          { text: "12:00 PM", onPress: () => updateTime("12:00") },
          { text: "6:00 PM", onPress: () => updateTime("18:00") },
          { text: "9:00 PM", onPress: () => updateTime("21:00") },
          { text: "Cancel", style: "cancel" },
        ]
      );
    }
  };

  const updateTime = async (time: string) => {
    setReminderTime(time);
    await updateNotificationSettings({ reminderTime: time });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const themedStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.background,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: currentTheme.text,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: currentTheme.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 4,
      elevation: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: currentTheme.text,
    },
    settingSubtitle: {
      fontSize: 14,
      color: currentTheme.textSecondary,
      marginTop: 2,
    },
    timeSelector: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: currentTheme.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      marginLeft: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 4,
      elevation: 1,
    },
    timeTitle: {
      fontSize: 14,
      color: currentTheme.textSecondary,
    },
    timeValue: {
      fontSize: 16,
      fontWeight: "600",
      color: currentTheme.text,
      marginTop: 2,
    },
    infoCard: {
      backgroundColor: currentTheme.surface,
      marginHorizontal: 20,
      padding: 16,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: "#8B5CF6",
    },
    infoTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: currentTheme.text,
      marginBottom: 8,
    },
    infoText: {
      fontSize: 14,
      color: currentTheme.textSecondary,
      lineHeight: 20,
    },
  });

  return (
    <View style={themedStyles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <LinearGradient
        colors={["#8B5CF6", "#6366F1"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView edges={["top"]}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              testID="back-button"
            >
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.title}>Notifications</Text>
            <View style={styles.placeholder} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color="#8B5CF6" />
            <Text style={themedStyles.sectionTitle}>Meditation Reminders</Text>
          </View>

          <View style={themedStyles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={themedStyles.settingTitle}>Daily Reminder</Text>
              <Text style={themedStyles.settingSubtitle}>
                Get reminded to meditate every day
              </Text>
            </View>
            <Switch
              value={settings.notifications.dailyReminder}
              onValueChange={(value) => handleToggle("dailyReminder", value)}
              trackColor={{ false: "#E5E7EB", true: "#8B5CF6" }}
              thumbColor="#FFFFFF"
              testID="daily-reminder-switch"
            />
          </View>

          {settings.notifications.dailyReminder && (
            <TouchableOpacity
              style={themedStyles.timeSelector}
              onPress={handleTimeChange}
              testID="time-selector"
            >
              <Clock size={20} color={currentTheme.textSecondary} />
              <View style={styles.timeInfo}>
                <Text style={themedStyles.timeTitle}>Reminder Time</Text>
                <Text style={themedStyles.timeValue}>{formatTime(reminderTime)}</Text>
              </View>
            </TouchableOpacity>
          )}

          <View style={themedStyles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={themedStyles.settingTitle}>Session Reminders</Text>
              <Text style={themedStyles.settingSubtitle}>
                Gentle reminders during meditation sessions
              </Text>
            </View>
            <Switch
              value={settings.notifications.sessionReminder}
              onValueChange={(value) => handleToggle("sessionReminder", value)}
              trackColor={{ false: "#E5E7EB", true: "#8B5CF6" }}
              thumbColor="#FFFFFF"
              testID="session-reminder-switch"
            />
          </View>

          <View style={themedStyles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={themedStyles.settingTitle}>Progress Updates</Text>
              <Text style={themedStyles.settingSubtitle}>
                Weekly progress and achievement notifications
              </Text>
            </View>
            <Switch
              value={settings.notifications.progressUpdates}
              onValueChange={(value) => handleToggle("progressUpdates", value)}
              trackColor={{ false: "#E5E7EB", true: "#8B5CF6" }}
              thumbColor="#FFFFFF"
              testID="progress-updates-switch"
            />
          </View>
        </View>

        {Platform.OS !== "web" && (
          <View style={themedStyles.infoCard}>
            <Text style={themedStyles.infoTitle}>About Notifications</Text>
            <Text style={themedStyles.infoText}>
              Notifications help you maintain a consistent meditation practice. 
              You can customize when and how you receive reminders to find what works best for you.
            </Text>
          </View>
        )}

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingBottom: 30,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    marginTop: -10,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  timeSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginLeft: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  timeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  timeTitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  timeValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: "#EEF2FF",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#8B5CF6",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  spacer: {
    height: 40,
  },
});