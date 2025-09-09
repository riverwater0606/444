import { useState, useEffect, useCallback, useMemo } from "react";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, Appearance, ColorSchemeName } from "react-native";
import * as Notifications from "expo-notifications";

export type Theme = "light" | "dark" | "system";
export type Language = "en" | "zh";

interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  text: string;
  textSecondary: string;
  border: string;
  card: string;
  gradient: string[];
}

const lightTheme: ThemeColors = {
  background: "#F9FAFB",
  surface: "#FFFFFF",
  primary: "#8B5CF6",
  secondary: "#6366F1",
  text: "#1F2937",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  card: "#FFFFFF",
  gradient: ["#8B5CF6", "#6366F1"],
};

const darkTheme: ThemeColors = {
  background: "#111827",
  surface: "#1F2937",
  primary: "#8B5CF6",
  secondary: "#6366F1",
  text: "#F9FAFB",
  textSecondary: "#D1D5DB",
  border: "#374151",
  card: "#1F2937",
  gradient: ["#8B5CF6", "#6366F1"],
};

interface NotificationSettings {
  dailyReminder: boolean;
  sessionReminder: boolean;
  progressUpdates: boolean;
  reminderTime: string; // HH:MM format
}

interface PrivacySettings {
  analytics: boolean;
  crashReporting: boolean;
  personalizedContent: boolean;
  dataSharing: boolean;
}

interface AppSettings {
  theme: Theme;
  language: Language;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

const defaultSettings: AppSettings = {
  theme: "light",
  language: "en",
  notifications: {
    dailyReminder: true,
    sessionReminder: true,
    progressUpdates: false,
    reminderTime: "09:00",
  },
  privacy: {
    analytics: true,
    crashReporting: true,
    personalizedContent: true,
    dataSharing: false,
  },
};

export const [SettingsProvider, useSettings] = createContextHook(() => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  const loadSettings = useCallback(async () => {
    try {
      const savedSettings = await AsyncStorage.getItem("appSettings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSettings = useCallback(async (newSettings: AppSettings) => {
    try {
      await AsyncStorage.setItem("appSettings", JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  }, []);

  const setupNotifications = useCallback(async () => {
    if (Platform.OS === "web") return;

    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Notification permissions not granted");
        return;
      }

      // Configure notification behavior
      await Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    } catch (error) {
      console.error("Error setting up notifications:", error);
    }
  }, []);

  const scheduleNotifications = useCallback(async (notificationSettings: NotificationSettings) => {
    if (Platform.OS === "web") return;

    try {
      // Cancel all existing notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      if (notificationSettings.dailyReminder) {
        const [hours, minutes] = notificationSettings.reminderTime.split(":").map(Number);
        
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Time to Meditate 🧘‍♀️",
            body: "Take a moment for yourself and find inner peace",
            sound: true,
          },
          trigger: {
            hour: hours,
            minute: minutes,
            repeats: true,
          } as Notifications.CalendarTriggerInput,
        });
      }
    } catch (error) {
      console.error("Error scheduling notifications:", error);
    }
  }, []);

  useEffect(() => {
    loadSettings();
    setupNotifications();
    
    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });
    
    return () => subscription?.remove();
  }, [loadSettings, setupNotifications]);

  const updateTheme = useCallback(async (theme: Theme) => {
    const newSettings = { ...settings, theme };
    await saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateLanguage = useCallback(async (language: Language) => {
    const newSettings = { ...settings, language };
    await saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateNotificationSettings = useCallback(async (notifications: Partial<NotificationSettings>) => {
    const newNotifications = { ...settings.notifications, ...notifications };
    const newSettings = { ...settings, notifications: newNotifications };
    await saveSettings(newSettings);

    // Schedule or cancel notifications based on settings
    if (Platform.OS !== "web") {
      await scheduleNotifications(newNotifications);
    }
  }, [settings, saveSettings, scheduleNotifications]);

  const updatePrivacySettings = useCallback(async (privacy: Partial<PrivacySettings>) => {
    const newPrivacy = { ...settings.privacy, ...privacy };
    const newSettings = { ...settings, privacy: newPrivacy };
    await saveSettings(newSettings);
  }, [settings, saveSettings]);

  const resetSettings = useCallback(async () => {
    await saveSettings(defaultSettings);
  }, [saveSettings]);

  const exportData = useCallback(async () => {
    try {
      const allData = {
        settings,
        timestamp: new Date().toISOString(),
      };
      return JSON.stringify(allData, null, 2);
    } catch (error) {
      console.error("Error exporting data:", error);
      throw error;
    }
  }, [settings]);

  const clearAllData = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([
        "appSettings",
        "userProfile",
        "walletAddress",
        "meditationProgress",
      ]);
      setSettings(defaultSettings);
    } catch (error) {
      console.error("Error clearing data:", error);
      throw error;
    }
  }, []);

  const currentTheme = useMemo(() => {
    if (settings.theme === "system") {
      return systemColorScheme === "dark" ? darkTheme : lightTheme;
    }
    return settings.theme === "dark" ? darkTheme : lightTheme;
  }, [settings.theme, systemColorScheme]);

  const isDarkMode = useMemo(() => {
    if (settings.theme === "system") {
      return systemColorScheme === "dark";
    }
    return settings.theme === "dark";
  }, [settings.theme, systemColorScheme]);

  return useMemo(() => ({
    settings,
    isLoading,
    currentTheme,
    isDarkMode,
    updateTheme,
    updateLanguage,
    updateNotificationSettings,
    updatePrivacySettings,
    resetSettings,
    exportData,
    clearAllData,
  }), [settings, isLoading, currentTheme, isDarkMode, updateTheme, updateLanguage, updateNotificationSettings, updatePrivacySettings, resetSettings, exportData, clearAllData]);
});