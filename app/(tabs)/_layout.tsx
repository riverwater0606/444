import { Tabs } from "expo-router";
import { Home, Activity, User, Sparkles, MessageCircle } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";
import { useSettings } from "@/providers/SettingsProvider";

export default function TabLayout() {
  const { currentTheme, settings } = useSettings();
  const lang = settings.language;

  const translations = {
    home: { en: "Home", zh: "首頁" },
    meditate: { en: "Meditate", zh: "冥想" },
    progress: { en: "Progress", zh: "進度" },
    profile: { en: "Profile", zh: "個人資料" },
    assistant: { en: "AI Assistant", zh: "AI助手" },
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: currentTheme.primary,
        tabBarInactiveTintColor: currentTheme.textSecondary,
        tabBarStyle: {
          backgroundColor: currentTheme.surface,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          height: Platform.OS === "ios" ? 85 : 65,
          paddingBottom: Platform.OS === "ios" ? 25 : 10,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: translations.home[lang],
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="meditate"
        options={{
          title: translations.meditate[lang],
          tabBarIcon: ({ color }) => <Sparkles size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: translations.progress[lang],
          tabBarIcon: ({ color }) => <Activity size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: translations.profile[lang],
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: translations.assistant[lang],
          tabBarIcon: ({ color }) => <MessageCircle size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}