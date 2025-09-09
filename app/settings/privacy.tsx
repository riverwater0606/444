import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, router } from "expo-router";
import { 
  ArrowLeft, 
  Shield, 
  Eye, 
  BarChart3, 
  Share2, 
  Download,
  Trash2,
  AlertTriangle
} from "lucide-react-native";
import { useSettings } from "@/providers/SettingsProvider";

export default function PrivacyScreen() {
  const { settings, updatePrivacySettings, exportData, clearAllData, currentTheme } = useSettings();

  const handleToggle = async (key: keyof typeof settings.privacy, value: boolean) => {
    await updatePrivacySettings({ [key]: value });
  };

  const handleExportData = async () => {
    try {
      const data = await exportData();
      Alert.alert(
        "Data Export",
        "Your data has been prepared for export. In a production app, this would be saved to your device or shared via email.",
        [
          { text: "OK" }
        ]
      );
      console.log("Exported data:", data);
    } catch (error) {
      Alert.alert("Error", "Failed to export data. Please try again.");
    }
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all your meditation progress, settings, and personal data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete All", 
          style: "destructive", 
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert("Success", "All data has been cleared.");
            } catch (error) {
              Alert.alert("Error", "Failed to clear data. Please try again.");
            }
          }
        }
      ]
    );
  };

  const privacySettings = [
    {
      key: "analytics" as const,
      icon: BarChart3,
      title: "Analytics",
      subtitle: "Help improve the app with usage analytics",
      value: settings.privacy.analytics,
    },
    {
      key: "crashReporting" as const,
      icon: AlertTriangle,
      title: "Crash Reporting",
      subtitle: "Send crash reports to help fix bugs",
      value: settings.privacy.crashReporting,
    },
    {
      key: "personalizedContent" as const,
      icon: Eye,
      title: "Personalized Content",
      subtitle: "Customize content based on your preferences",
      value: settings.privacy.personalizedContent,
    },
    {
      key: "dataSharing" as const,
      icon: Share2,
      title: "Data Sharing",
      subtitle: "Share anonymized data for research",
      value: settings.privacy.dataSharing,
    },
  ];

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
    actionItem: {
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
    actionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: currentTheme.text,
    },
    actionSubtitle: {
      fontSize: 14,
      color: currentTheme.textSecondary,
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
            <Text style={styles.title}>Privacy & Security</Text>
            <View style={styles.placeholder} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={20} color="#8B5CF6" />
            <Text style={themedStyles.sectionTitle}>Privacy Settings</Text>
          </View>

          {privacySettings.map((setting) => {
            const Icon = setting.icon;
            return (
              <View key={setting.key} style={themedStyles.settingItem}>
                <View style={styles.settingIcon}>
                  <Icon size={20} color={currentTheme.textSecondary} />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={themedStyles.settingTitle}>{setting.title}</Text>
                  <Text style={themedStyles.settingSubtitle}>{setting.subtitle}</Text>
                </View>
                <Switch
                  value={setting.value}
                  onValueChange={(value) => handleToggle(setting.key, value)}
                  trackColor={{ false: "#E5E7EB", true: "#8B5CF6" }}
                  thumbColor="#FFFFFF"
                  testID={`privacy-${setting.key}-switch`}
                />
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={themedStyles.sectionTitle}>Data Management</Text>

          <TouchableOpacity
            style={themedStyles.actionItem}
            onPress={handleExportData}
            testID="export-data-button"
          >
            <View style={styles.actionIcon}>
              <Download size={20} color="#059669" />
            </View>
            <View style={styles.actionInfo}>
              <Text style={themedStyles.actionTitle}>Export My Data</Text>
              <Text style={themedStyles.actionSubtitle}>
                Download a copy of all your data
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={themedStyles.actionItem}
            onPress={handleClearData}
            testID="clear-data-button"
          >
            <View style={[styles.actionIcon, styles.dangerIcon]}>
              <Trash2 size={20} color="#DC2626" />
            </View>
            <View style={styles.actionInfo}>
              <Text style={[themedStyles.actionTitle, styles.dangerText]}>
                Clear All Data
              </Text>
              <Text style={themedStyles.actionSubtitle}>
                Permanently delete all your data
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={themedStyles.infoCard}>
          <Text style={themedStyles.infoTitle}>Your Privacy Matters</Text>
          <Text style={themedStyles.infoText}>
            We are committed to protecting your privacy. All meditation data is stored locally on your device. 
            You have full control over what information is shared and can export or delete your data at any time.
          </Text>
        </View>

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
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
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
  actionItem: {
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
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  dangerIcon: {
    backgroundColor: "#FEF2F2",
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  dangerText: {
    color: "#DC2626",
  },
  actionSubtitle: {
    fontSize: 14,
    color: "#6B7280",
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