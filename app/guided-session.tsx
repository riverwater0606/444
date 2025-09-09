import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  X,
  Volume2,
  Globe,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GUIDED_MEDITATIONS } from "@/constants/meditationGuidance";

type Language = 'en' | 'zh';

const TRANSLATIONS = {
  en: {
    notFound: "Meditation practice not found",
    step: "Step",
    benefits: "Practice Benefits",
  },
  zh: {
    notFound: "冥想練習未找到",
    step: "步驟",
    benefits: "練習益處",
  },
};

const { width } = Dimensions.get("window");

export default function GuidedSessionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const meditation = GUIDED_MEDITATIONS.find((m) => m.id === id);
  const [language, setLanguage] = useState<Language>('en');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const breathAnimation = useRef(new Animated.Value(0)).current;
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (meditation) {
      setTimeRemaining(meditation.duration * 60);
    }
  }, [meditation]);

  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, timeRemaining]);

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(breathAnimation, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(breathAnimation, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      breathAnimation.stopAnimation();
    }
  }, [isPlaying, breathAnimation]);

  useEffect(() => {
    if (meditation) {
      const progress = currentStep / (meditation.steps[language].length - 1);
      Animated.timing(progressAnimation, {
        toValue: progress,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [currentStep, meditation, progressAnimation, language]);

  if (!meditation) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>{t.notFound}</Text>
      </View>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextStep = () => {
    if (currentStep < meditation.steps[language].length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  const breathScale = breathAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  const breathOpacity = breathAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <LinearGradient
      colors={["#1E293B", "#334155", "#475569"]}
      style={styles.container}
    >
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <X color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{meditation.title[language]}</Text>
        <TouchableOpacity onPress={toggleLanguage} style={styles.languageButton}>
          <Globe color="#FFFFFF" size={20} />
          <Text style={styles.languageText}>{language.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.visualContainer}>
          <Animated.View
            style={[
              styles.breathCircle,
              {
                transform: [{ scale: breathScale }],
                opacity: breathOpacity,
              },
            ]}
          />
          <View style={styles.innerCircle}>
            <Volume2 color="#FFFFFF" size={40} />
          </View>
        </View>

        <Text style={styles.timer}>{formatTime(timeRemaining)}</Text>

        <View style={styles.stepContainer}>
          <Text style={styles.stepNumber}>
            {t.step} {currentStep + 1} / {meditation.steps[language].length}
          </Text>
          <Text style={styles.stepText}>
            {meditation.steps[language][currentStep]}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handlePrevStep}
            disabled={currentStep === 0}
          >
            <SkipBack
              color={currentStep === 0 ? "#64748B" : "#FFFFFF"}
              size={24}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playButton}
            onPress={handlePlayPause}
          >
            <LinearGradient
              colors={["#8B5CF6", "#7C3AED"]}
              style={styles.playButtonGradient}
            >
              {isPlaying ? (
                <Pause color="#FFFFFF" size={32} />
              ) : (
                <Play color="#FFFFFF" size={32} />
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleNextStep}
            disabled={currentStep === meditation.steps[language].length - 1}
          >
            <SkipForward
              color={
                currentStep === meditation.steps[language].length - 1
                  ? "#64748B"
                  : "#FFFFFF"
              }
              size={24}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>{t.benefits}</Text>
          <View style={styles.benefitsList}>
            {meditation.benefits[language].map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <View style={styles.benefitDot} />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    gap: 4,
  },
  languageText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  visualContainer: {
    width: width - 40,
    height: width - 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  breathCircle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#8B5CF6",
  },
  innerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(139, 92, 246, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  timer: {
    fontSize: 48,
    fontWeight: "200",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 30,
  },
  stepContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  stepNumber: {
    fontSize: 14,
    color: "#94A3B8",
    marginBottom: 8,
  },
  stepText: {
    fontSize: 18,
    color: "#FFFFFF",
    lineHeight: 26,
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#8B5CF6",
    borderRadius: 2,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    marginHorizontal: 15,
  },
  playButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  benefitsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#8B5CF6",
    marginRight: 10,
  },
  benefitText: {
    fontSize: 14,
    color: "#CBD5E1",
  },
  errorText: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 50,
  },
});