import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,

} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { 
  User, 
  Wallet, 
  Bell, 
  Moon, 
  Globe, 
  Shield,
  LogOut,
  ChevronRight,
  Edit2
} from "lucide-react-native";
import { useUser } from "@/providers/UserProvider";
import { useSettings } from "@/providers/SettingsProvider";
import { router } from "expo-router";
import { Platform } from "react-native";
import { WorldIDVerifyButton, OpenInWorldAppBanner, useIsWorldApp } from "@/components/worldcoin/IDKitWeb";

export default function ProfileScreen() {
  const { profile, updateProfile, connectWallet, walletAddress } = useUser();
  const { settings, currentTheme, isDarkMode } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const lang = settings.language;
  const isWorldApp = useIsWorldApp();

  const handleSave = () => {
    updateProfile({ name });
    setIsEditing(false);
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      Alert.alert(
        lang === "zh" ? "成功" : "Success", 
        lang === "zh" ? "錢包連接成功！" : "Wallet connected successfully!"
      );
    } catch (error) {
      Alert.alert(
        lang === "zh" ? "錯誤" : "Error", 
        lang === "zh" ? "連接錢包失敗。請重試。" : "Failed to connect wallet. Please try again."
      );
    }
  };

  const getThemeSubtitle = () => {
    const themes = {
      light: { en: "Light mode", zh: "淺色模式" },
      dark: { en: "Dark mode", zh: "深色模式" },
      system: { en: "System default", zh: "系統預設" },
    };
    return themes[settings.theme]?.[lang] || themes.light[lang];
  };

  const getLanguageSubtitle = () => {
    switch (settings.language) {
      case "en": return "English";
      case "zh": return "中文";
      default: return "English";
    }
  };

  const translations = {
    notifications: { en: "Notifications", zh: "通知" },
    theme: { en: "Theme", zh: "主題" },
    language: { en: "Language", zh: "語言" },
    privacy: { en: "Privacy & Security", zh: "隱私與安全" },
    remindersEnabled: { en: "Reminders enabled", zh: "提醒已啟用" },
    remindersDisabled: { en: "Reminders disabled", zh: "提醒已停用" },
    manageData: { en: "Manage your data", zh: "管理您的數據" },
  };

  const settingsItems = [
    { 
      id: "notifications", 
      icon: Bell, 
      title: translations.notifications[lang], 
      subtitle: settings.notifications.dailyReminder 
        ? translations.remindersEnabled[lang] 
        : translations.remindersDisabled[lang],
      onPress: () => router.push("/settings/notifications")
    },
    { 
      id: "theme", 
      icon: Moon, 
      title: translations.theme[lang], 
      subtitle: getThemeSubtitle(),
      onPress: () => router.push("/settings/theme")
    },
    { 
      id: "language", 
      icon: Globe, 
      title: translations.language[lang], 
      subtitle: getLanguageSubtitle(),
      onPress: () => router.push("/settings/language")
    },
    { 
      id: "privacy", 
      icon: Shield, 
      title: translations.privacy[lang], 
      subtitle: translations.manageData[lang],
      onPress: () => router.push("/settings/privacy")
    },
  ];

  const themedStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.background,
    },
    profileCard: {
      backgroundColor: currentTheme.card,
      marginHorizontal: 20,
      marginBottom: 20,
      padding: 20,
      borderRadius: 16,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    profileName: {
      fontSize: 20,
      fontWeight: "bold",
      color: currentTheme.text,
    },
    profileEmail: {
      fontSize: 14,
      color: currentTheme.textSecondary,
      marginTop: 4,
    },
    nameInput: {
      width: "100%",
      borderWidth: 1,
      borderColor: currentTheme.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 16,
      marginBottom: 12,
      color: currentTheme.text,
      backgroundColor: currentTheme.surface,
    },
    cancelButton: {
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: currentTheme.border,
    },
    cancelButtonText: {
      color: currentTheme.textSecondary,
      fontWeight: "600",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: currentTheme.text,
      marginBottom: 16,
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
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: currentTheme.surface,
      justifyContent: "center",
      alignItems: "center",
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
  });

  return (
    <View style={themedStyles.container}>
      <LinearGradient
        colors={currentTheme.gradient as any}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView edges={["top"]}>
          <Text style={styles.title}>
            {lang === "zh" ? "個人資料" : "Profile"}
          </Text>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={themedStyles.profileCard}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={currentTheme.gradient as any}
              style={styles.avatar}
            >
              <User size={40} color="#FFFFFF" />
            </LinearGradient>
          </View>

          {isEditing ? (
            <View style={styles.editContainer}>
              <TextInput
                style={themedStyles.nameInput}
                value={name}
                onChangeText={setName}
                placeholder={lang === "zh" ? "輸入您的名稱" : "Enter your name"}
                placeholderTextColor={currentTheme.textSecondary}
              />
              <View style={styles.editButtons}>
                <TouchableOpacity
                  style={themedStyles.cancelButton}
                  onPress={() => {
                    setName(profile.name);
                    setIsEditing(false);
                  }}
                >
                  <Text style={themedStyles.cancelButtonText}>
                    {lang === "zh" ? "取消" : "Cancel"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>
                    {lang === "zh" ? "儲存" : "Save"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={themedStyles.profileName}>
                  {profile.name || (lang === "zh" ? "靈性探索者" : "Spiritual Seeker")}
                </Text>
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Edit2 size={18} color="#8B5CF6" />
                </TouchableOpacity>
              </View>
              <Text style={themedStyles.profileEmail}>
                {lang === "zh" ? `成員自 ${new Date().getFullYear()}` : `Member since ${new Date().getFullYear()}`}
              </Text>
            </View>
          )}
        </View>

        {/* Web3 Wallet */}
        <TouchableOpacity
          style={styles.walletCard}
          onPress={handleConnectWallet}
          testID="connect-wallet"
        >
          <LinearGradient
            colors={["#F59E0B", "#EF4444"]}
            style={styles.walletGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Wallet size={24} color="#FFFFFF" />
            <View style={styles.walletInfo}>
              <Text style={styles.walletTitle}>
                {walletAddress 
                  ? (lang === "zh" ? "錢包已連接" : "Wallet Connected")
                  : (lang === "zh" ? "連接 Web3 錢包" : "Connect Web3 Wallet")
                }
              </Text>
              <Text style={styles.walletSubtitle}>
                {walletAddress 
                  ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                  : (lang === "zh" ? "解鎖區塊鏈功能" : "Unlock blockchain features")
                }
              </Text>
            </View>
            <ChevronRight size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        {/* World ID Verification */}
        {Platform.OS === 'web' && (
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }} testID="worldid-section">
            <Text style={[themedStyles.sectionTitle]}>
              {lang === 'zh' ? 'World ID 驗證' : 'World ID Verification'}
            </Text>
            {!isWorldApp && <OpenInWorldAppBanner testID="worldapp-banner" />}
            <View style={{ marginTop: 12 }}>
              <WorldIDVerifyButton
                appId={process.env.WORLD_ID_APP_ID ?? 'app_346b0844d114f6bac06f1d35eb9f3d1d'}
                action={process.env.WORLD_ID_ACTION_ID ?? 'psig'}
                callbackUrl={(typeof window !== 'undefined' && window.location?.host?.includes('localhost'))
                  ? 'http://localhost:3000/callback'
                  : (process.env.WORLD_ID_CALLBACK_URL ?? 'https://444-two.vercel.app/callback')}
                testID="verify-with-worldid"
              />
            </View>
          </View>
        )}

        {/* Settings */}
        <View style={styles.settingsContainer}>
          <Text style={themedStyles.sectionTitle}>
            {lang === "zh" ? "設定" : "Settings"}
          </Text>
          {settingsItems.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={themedStyles.settingItem}
                onPress={item.onPress}
                testID={`setting-${item.id}`}
              >
                <View style={themedStyles.settingIcon}>
                  <Icon size={20} color={currentTheme.textSecondary} />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={themedStyles.settingTitle}>{item.title}</Text>
                  <Text style={themedStyles.settingSubtitle}>{item.subtitle}</Text>
                </View>
                <ChevronRight size={20} color="#D1D5DB" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          style={[styles.signOutButton, { backgroundColor: isDarkMode ? "#7F1D1D" : "#FEE2E2" }]}
          onPress={() => Alert.alert(
            lang === "zh" ? "登出" : "Sign Out", 
            lang === "zh" ? "您確定要登出嗎？" : "Are you sure you want to sign out?", 
            [
              { text: lang === "zh" ? "取消" : "Cancel", style: "cancel" },
              { text: lang === "zh" ? "登出" : "Sign Out", style: "destructive", onPress: () => console.log("Sign out") }
            ]
          )}
        >
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.signOutText}>
            {lang === "zh" ? "登出" : "Sign Out"}
          </Text>
        </TouchableOpacity>

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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  content: {
    flex: 1,
    marginTop: -10,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    alignItems: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  profileEmail: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  editContainer: {
    width: "100%",
    alignItems: "center",
  },
  nameInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  editButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cancelButtonText: {
    color: "#6B7280",
    fontWeight: "600",
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#8B5CF6",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  walletCard: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 16,
    overflow: "hidden",
  },
  walletGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  walletInfo: {
    flex: 1,
    marginLeft: 16,
  },
  walletTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  walletSubtitle: {
    fontSize: 14,
    color: "#FEF3C7",
    marginTop: 2,
  },
  settingsContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
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
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  settingInfo: {
    flex: 1,
    marginLeft: 12,
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
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
    marginLeft: 8,
  },
  spacer: {
    height: 40,
  },
});