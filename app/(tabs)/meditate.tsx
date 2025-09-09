import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Search, Clock, Headphones } from "lucide-react-native";
import { router } from "expo-router";
import { MEDITATION_SESSIONS, CATEGORIES } from "@/constants/meditations";
import { useSettings } from "@/providers/SettingsProvider";

const { width } = Dimensions.get("window");

export default function MeditateScreen() {
  const { currentTheme } = useSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredSessions = MEDITATION_SESSIONS.filter((session) => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || session.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <LinearGradient
        colors={currentTheme.gradient as [string, string]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView edges={["top"]}>
          <Text style={styles.title}>Meditation Library</Text>
          
          <View style={[styles.searchContainer, { backgroundColor: currentTheme.surface }]}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={[styles.searchInput, { color: currentTheme.text }]}
              placeholder="Search meditations..."
              placeholderTextColor={currentTheme.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                { backgroundColor: currentTheme.surface, borderColor: currentTheme.border },
                selectedCategory === category.id && { backgroundColor: currentTheme.primary, borderColor: currentTheme.primary },
              ]}
              onPress={() => setSelectedCategory(category.id)}
              testID={`category-${category.id}`}
            >
              <Text
                style={[
                  styles.categoryText,
                  { color: currentTheme.textSecondary },
                  selectedCategory === category.id && { color: "#FFFFFF" },
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sessions Grid */}
        <View style={styles.sessionsGrid}>
          {filteredSessions.map((session, index) => (
            <TouchableOpacity
              key={session.id}
              style={[
                styles.sessionCard,
                index % 2 === 0 ? styles.sessionCardLeft : styles.sessionCardRight,
              ]}
              onPress={() => router.push(`/meditation/${session.id}`)}
              testID={`meditation-${session.id}`}
            >
              <LinearGradient
                colors={session.gradient as [string, string]}
                style={styles.sessionCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.sessionCardContent}>
                  <Text style={styles.sessionCardTitle}>{session.title}</Text>
                  <Text style={styles.sessionCardDescription} numberOfLines={2}>
                    {session.description}
                  </Text>
                  
                  <View style={styles.sessionCardMeta}>
                    <View style={styles.sessionCardMetaItem}>
                      <Clock size={14} color="#E0E7FF" />
                      <Text style={styles.sessionCardMetaText}>{session.duration} min</Text>
                    </View>
                    <View style={styles.sessionCardMetaItem}>
                      <Headphones size={14} color="#E0E7FF" />
                      <Text style={styles.sessionCardMetaText}>{session.narrator}</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
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
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  categoriesContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  sessionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
  },
  sessionCard: {
    width: (width - 50) / 2,
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
  },
  sessionCardLeft: {
    marginRight: 10,
  },
  sessionCardRight: {
    marginLeft: 0,
  },
  sessionCardGradient: {
    padding: 16,
    minHeight: 160,
  },
  sessionCardContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  sessionCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  sessionCardDescription: {
    fontSize: 12,
    color: "#E0E7FF",
    lineHeight: 18,
    marginBottom: 12,
  },
  sessionCardMeta: {
    marginTop: "auto",
  },
  sessionCardMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  sessionCardMetaText: {
    fontSize: 11,
    color: "#E0E7FF",
    marginLeft: 4,
  },
  bottomSpacing: {
    height: 20,
  },
});