import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Play, Clock, Heart, Moon, Brain, Zap } from "lucide-react-native";
import { router } from "expo-router";
import { loadIDKitScript } from "@/components/worldcoin/IDKitWeb";
import { useMeditation } from "@/providers/MeditationProvider";
import { useUser } from "@/providers/UserProvider";
import { useSettings } from "@/providers/SettingsProvider";
import { DAILY_AFFIRMATIONS } from "@/constants/affirmations";
import { MEDITATION_SESSIONS } from "@/constants/meditations";



export default function HomeScreen() {
  const { stats } = useMeditation();
  const { profile } = useUser();
  const { currentTheme, settings } = useSettings();
  const [affirmation, setAffirmation] = useState(DAILY_AFFIRMATIONS[0]);
  const [worldError, setWorldError] = useState<string | null>(null);
  const widgetRef = useRef<any | null>(null);
  const isWeb = Platform.OS === 'web';
  const isWorldEnv = useMemo(() => {
    if (!isWeb) return false;
    const ua = (typeof navigator !== 'undefined' ? navigator.userAgent : '') ?? '';
    const w = typeof window !== 'undefined' ? (window as any) : {};
    return ua.includes('WorldApp') || !!w.MiniKit || !!w.miniwallet;
  }, [isWeb]);
  const lang = settings.language;

  useEffect(() => {
    const today = new Date().getDay();
    setAffirmation(DAILY_AFFIRMATIONS[today % DAILY_AFFIRMATIONS.length]);
  }, []);

  useEffect(() => {
    if (!isWeb) return;
    let cancelled = false;
    async function initWorldID() {
      if (!isWorldEnv) return;
      try {
        await loadIDKitScript();
        if (cancelled) return;
        if (!widgetRef.current) {
          const el: any = document.createElement('idkit-widget');
          el.setAttribute('style', 'display:none');
          el.app_id = process.env.WORLD_ID_APP_ID ?? 'app_346b0844d114f6bac06f1d35eb9f3d1d';
          el.action = process.env.WORLD_ID_ACTION_ID ?? 'psig';
          el.verification_level = 'orb';
          el.setAttribute('crossorigin', 'anonymous');
          (el as any).referrerPolicy = 'no-referrer';
          el.enableTelemetry = true;
          el.handleVerify = (proof: unknown) => {
            console.log('Proof:', proof);
          };
          el.onSuccess = (res: unknown) => {
            console.log('Success');
            try {
              const callbackUrl = (typeof window !== 'undefined' && (window.location?.host?.includes('localhost') || window.location?.host?.includes('127.0.0.1')))
                ? 'http://localhost:3000/callback'
                : (process.env.WORLD_ID_CALLBACK_URL ?? 'https://444-two.vercel.app/callback');
              const url = new URL(callbackUrl);
              url.searchParams.set('result', encodeURIComponent(JSON.stringify(res)));
              window.location.href = url.toString();
            } catch (e: any) {
              console.error('Callback redirect error', e);
            }
          };
          el.onError = (err: any) => {
            console.error('[WorldID] error', err);
            setWorldError(err?.message ?? 'Unknown error');
          };
          document.body.appendChild(el);
          widgetRef.current = el;
        }
        if (typeof widgetRef.current?.open === 'function') {
          console.log('[WorldID] Auto opening IDKitWidget on HomeScreen');
          widgetRef.current.open();
        } else {
          const sdk: any = (window as any).IDKit ?? (window as any).WorldID?.IDKit ?? (window as any).worldID?.IDKit;
          if (sdk && typeof sdk.open === 'function') {
            console.log('[WorldID] Auto opening via SDK.open on HomeScreen');
            sdk.open({
              app_id: process.env.WORLD_ID_APP_ID ?? 'app_346b0844d114f6bac06f1d35eb9f3d1d',
              action: process.env.WORLD_ID_ACTION_ID ?? 'psig',
              verification_level: 'orb',
              enableTelemetry: true,
              options: { theme: 'auto' },
              handleVerify: (proof: unknown) => console.log('Proof:', proof),
              onSuccess: (result: unknown) => {
                console.log('Success');
                try {
                  const callbackUrl = (typeof window !== 'undefined' && (window.location?.host?.includes('localhost') || window.location?.host?.includes('127.0.0.1')))
                    ? 'http://localhost:3000/callback'
                    : (process.env.WORLD_ID_CALLBACK_URL ?? 'https://444-two.vercel.app/callback');
                  const url = new URL(callbackUrl);
                  url.searchParams.set('result', encodeURIComponent(JSON.stringify(result)));
                  window.location.href = url.toString();
                } catch (e: any) {
                  console.error('Callback redirect error', e);
                }
              },
              onError: (err: any) => {
                console.error('[WorldID] error', err);
                setWorldError(err?.message ?? 'Unknown error');
              },
              onClose: () => {
                console.log('[WorldID] closed');
              },
            });
          }
        }
      } catch (e: any) {
        console.error('IDKit load error', e);
        setWorldError(e?.message ?? 'Failed to load World ID');
      }
    }
    initWorldID();
    return () => {
      cancelled = true;
    };
  }, [isWeb, isWorldEnv]);

  const quickActions = [
    { id: "breathing", title: lang === "zh" ? "呼吸" : "Breathing", icon: Heart, color: "#EC4899" },
    { id: "timer", title: lang === "zh" ? "計時器" : "Timer", icon: Clock, color: "#3B82F6" },
    { id: "sleep", title: lang === "zh" ? "睡眠" : "Sleep", icon: Moon, color: "#8B5CF6" },
    { id: "focus", title: lang === "zh" ? "專注" : "Focus", icon: Brain, color: "#10B981" },
  ];

  const featuredSessions = MEDITATION_SESSIONS.filter(s => s.featured).slice(0, 3);

  const handleQuickAction = (actionId: string) => {
    if (actionId === "breathing") {
      router.push("/breathing");
    } else if (actionId === "timer") {
      router.push("/timer");
    } else {
      router.push("/meditate");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <LinearGradient
        colors={currentTheme.gradient as any}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView edges={["top"]}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>
                {getGreeting(lang)}, {profile.name || (lang === "zh" ? "探索者" : "Seeker")}
              </Text>
              <Text style={styles.subtitle}>
                {lang === "zh" ? "您的旅程繼續" : "Your journey continues"}
              </Text>
            </View>
            <View style={styles.streakContainer}>
              <Zap size={20} color="#FCD34D" />
              <Text style={styles.streakText}>{stats.currentStreak}</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isWeb && !isWorldEnv && (
          <View style={styles.worldBanner} testID="worldid-scan-banner">
            <Text style={styles.worldBannerTitle}>{lang === 'zh' ? '掃描以在 World App 驗證' : 'Scan to Verify in World App'}</Text>
            {!!worldError && (
              <Text style={styles.worldBannerError} testID="worldid-error">{worldError}</Text>
            )}
          </View>
        )}
        {/* Daily Affirmation */}
        <View style={[styles.affirmationCard, { backgroundColor: currentTheme.card }]}>
          <Text style={[styles.affirmationLabel, { color: currentTheme.primary }]}>
            {lang === "zh" ? "今日肯定語" : "Today's Affirmation"}
          </Text>
          <Text style={[styles.affirmationText, { color: currentTheme.text }]}>
            {affirmation.text}
          </Text>
          <Text style={[styles.affirmationAuthor, { color: currentTheme.textSecondary }]}>
            - {affirmation.author}
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <TouchableOpacity
                key={action.id}
                style={styles.quickAction}
                onPress={() => handleQuickAction(action.id)}
                testID={`quick-action-${action.id}`}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + "20" }]}>
                  <Icon size={24} color={action.color} />
                </View>
                <Text style={[styles.quickActionText, { color: currentTheme.textSecondary }]}>
                  {action.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Featured Sessions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
              {lang === "zh" ? "精選課程" : "Featured Sessions"}
            </Text>
            <TouchableOpacity onPress={() => router.push("/meditate")}>
              <Text style={[styles.seeAll, { color: currentTheme.primary }]}>
                {lang === "zh" ? "查看全部" : "See all"}
              </Text>
            </TouchableOpacity>
          </View>

          {featuredSessions.map((session) => (
            <TouchableOpacity
              key={session.id}
              style={styles.sessionCard}
              onPress={() => router.push(`/meditation/${session.id}`)}
              testID={`session-${session.id}`}
            >
              <LinearGradient
                colors={session.gradient as any}
                style={styles.sessionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.sessionContent}>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionTitle}>{session.title}</Text>
                    <Text style={styles.sessionDuration}>{session.duration} min</Text>
                  </View>
                  <Play size={20} color="#FFFFFF" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Overview */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: currentTheme.card }]}>
            <Text style={[styles.statValue, { color: currentTheme.primary }]}>
              {stats.totalSessions}
            </Text>
            <Text style={[styles.statLabel, { color: currentTheme.textSecondary }]}>
              {lang === "zh" ? "課程" : "Sessions"}
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: currentTheme.card }]}>
            <Text style={[styles.statValue, { color: currentTheme.primary }]}>
              {Math.floor(stats.totalMinutes / 60)}h
            </Text>
            <Text style={[styles.statLabel, { color: currentTheme.textSecondary }]}>
              {lang === "zh" ? "總時間" : "Total Time"}
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: currentTheme.card }]}>
            <Text style={[styles.statValue, { color: currentTheme.primary }]}>
              {stats.currentStreak}
            </Text>
            <Text style={[styles.statLabel, { color: currentTheme.textSecondary }]}>
              {lang === "zh" ? "連續天數" : "Day Streak"}
            </Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

function getGreeting(lang: "en" | "zh" = "en") {
  const hour = new Date().getHours();
  const greetings = {
    morning: { en: "Good morning", zh: "早安" },
    afternoon: { en: "Good afternoon", zh: "午安" },
    evening: { en: "Good evening", zh: "晚安" },
  };
  
  if (hour < 12) return greetings.morning[lang];
  if (hour < 18) return greetings.afternoon[lang];
  return greetings.evening[lang];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  headerGradient: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 16,
    color: "#E0E7FF",
    marginTop: 4,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 4,
  },
  content: {
    flex: 1,
    marginTop: -10,
  },
  affirmationCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  affirmationLabel: {
    fontSize: 12,
    color: "#8B5CF6",
    fontWeight: "600",
    marginBottom: 8,
  },
  affirmationText: {
    fontSize: 18,
    color: "#1F2937",
    lineHeight: 26,
    fontStyle: "italic",
  },
  affirmationAuthor: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 12,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  quickAction: {
    alignItems: "center",
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "500",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  seeAll: {
    fontSize: 14,
    color: "#8B5CF6",
    fontWeight: "600",
  },
  sessionCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  sessionGradient: {
    padding: 16,
  },
  sessionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  sessionDuration: {
    fontSize: 14,
    color: "#E0E7FF",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  worldBanner: {
    backgroundColor: "#111827",
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
  },
  worldBannerTitle: {
    color: "#F9FAFB",
    fontSize: 14,
    fontWeight: "700",
  },
  worldBannerError: {
    color: "#FCA5A5",
    marginTop: 6,
    fontSize: 12,
  },
});