import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { TrendingUp, Calendar, Award, Target } from "lucide-react-native";
import { useMeditation } from "@/providers/MeditationProvider";
import { useSettings } from "@/providers/SettingsProvider";

const { width } = Dimensions.get("window");

export default function ProgressScreen() {
  const { currentTheme } = useSettings();
  const { stats, achievements } = useMeditation();

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const currentDay = new Date().getDay();

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <LinearGradient
        colors={["#10B981", "#059669"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView edges={["top"]}>
          <Text style={styles.title}>Your Progress</Text>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <View style={[styles.statCard, { backgroundColor: currentTheme.surface }]}>
              <View style={styles.statIcon}>
                <TrendingUp size={24} color="#10B981" />
              </View>
              <Text style={[styles.statValue, { color: currentTheme.text }]}>{stats.currentStreak}</Text>
              <Text style={[styles.statLabel, { color: currentTheme.textSecondary }]}>Day Streak</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: currentTheme.surface }]}>
              <View style={styles.statIcon}>
                <Calendar size={24} color="#8B5CF6" />
              </View>
              <Text style={[styles.statValue, { color: currentTheme.text }]}>{stats.totalSessions}</Text>
              <Text style={[styles.statLabel, { color: currentTheme.textSecondary }]}>Total Sessions</Text>
            </View>
          </View>
          
          <View style={styles.statRow}>
            <View style={[styles.statCard, { backgroundColor: currentTheme.surface }]}>
              <View style={styles.statIcon}>
                <Target size={24} color="#3B82F6" />
              </View>
              <Text style={[styles.statValue, { color: currentTheme.text }]}>{Math.floor(stats.totalMinutes / 60)}h</Text>
              <Text style={[styles.statLabel, { color: currentTheme.textSecondary }]}>Total Time</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: currentTheme.surface }]}>
              <View style={styles.statIcon}>
                <Award size={24} color="#F59E0B" />
              </View>
              <Text style={[styles.statValue, { color: currentTheme.text }]}>{achievements.filter(a => a.unlocked).length}</Text>
              <Text style={[styles.statLabel, { color: currentTheme.textSecondary }]}>Achievements</Text>
            </View>
          </View>
        </View>

        {/* Weekly Progress */}
        <View style={styles.weeklyContainer}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>This Week</Text>
          <View style={[styles.weekGrid, { backgroundColor: currentTheme.surface }]}>
            {weekDays.map((day, index) => {
              const isToday = index === currentDay;
              const isCompleted = stats.weekProgress[index];
              
              return (
                <View key={`day-${index}`} style={styles.dayContainer}>
                  <Text style={[styles.dayLabel, { color: currentTheme.textSecondary }, isToday && { color: currentTheme.primary, fontWeight: "bold" }]}>
                    {day}
                  </Text>
                  <View
                    style={[
                      styles.dayCircle,
                      { borderColor: currentTheme.border },
                      isCompleted && styles.dayCircleCompleted,
                      isToday && { borderColor: currentTheme.primary },
                    ]}
                  >
                    {isCompleted && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsContainer}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  { backgroundColor: currentTheme.surface },
                  !achievement.unlocked && styles.achievementCardLocked,
                ]}
              >
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text style={[styles.achievementTitle, { color: currentTheme.text }]}>{achievement.title}</Text>
                <Text style={[styles.achievementDescription, { color: currentTheme.textSecondary }]}>
                  {achievement.description}
                </Text>
                {achievement.unlocked && (
                  <View style={styles.achievementBadge}>
                    <Text style={styles.achievementBadgeText}>Unlocked</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    marginBottom: 12,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  weeklyContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  weekGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dayContainer: {
    alignItems: "center",
  },
  dayLabel: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: "500",
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  dayCircleCompleted: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  achievementsContainer: {
    paddingHorizontal: 20,
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  achievementCard: {
    width: (width - 50) / 2,
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  achievementCardLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  achievementDescription: {
    fontSize: 12,
    textAlign: "center",
  },
  achievementBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  achievementBadgeText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  bottomSpacing: {
    height: 20,
  },
});