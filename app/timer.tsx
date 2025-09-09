import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { X, Play, Pause, RotateCcw, Plus, Minus } from "lucide-react-native";
import { router } from "expo-router";
import { useMeditation } from "@/providers/MeditationProvider";

const { width } = Dimensions.get("window");

const PRESET_TIMES = [5, 10, 15, 20, 30, 45, 60];

export default function TimerScreen() {
  const [duration, setDuration] = useState(10);
  const [timeRemaining, setTimeRemaining] = useState(10 * 60);
  const [isActive, setIsActive] = useState(false);
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const { completeMeditation } = useMeditation();

  useEffect(() => {
    setTimeRemaining(duration * 60);
  }, [duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            completeMeditation("timer", duration);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnimation.stopAnimation();
      pulseAnimation.setValue(1);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeRemaining(duration * 60);
  };

  const adjustDuration = (increment: number) => {
    if (!isActive) {
      const newDuration = Math.max(1, Math.min(120, duration + increment));
      setDuration(newDuration);
    }
  };

  return (
    <LinearGradient
      colors={["#7C3AED", "#6D28D9", "#5B21B6"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
            testID="close-timer"
          >
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Meditation Timer</Text>

          {/* Timer Display */}
          <Animated.View
            style={[
              styles.timerContainer,
              {
                transform: [{ scale: pulseAnimation }],
              },
            ]}
          >
            <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
          </Animated.View>

          {/* Duration Adjuster */}
          {!isActive && (
            <View style={styles.durationContainer}>
              <TouchableOpacity
                style={styles.adjustButton}
                onPress={() => adjustDuration(-5)}
                testID="decrease-duration"
              >
                <Minus size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.durationDisplay}>
                <Text style={styles.durationValue}>{duration}</Text>
                <Text style={styles.durationLabel}>minutes</Text>
              </View>

              <TouchableOpacity
                style={styles.adjustButton}
                onPress={() => adjustDuration(5)}
                testID="increase-duration"
              >
                <Plus size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          {/* Preset Times */}
          {!isActive && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.presetsContainer}
              contentContainerStyle={styles.presetsContent}
            >
              {PRESET_TIMES.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.presetButton,
                    duration === time && styles.presetButtonActive,
                  ]}
                  onPress={() => setDuration(time)}
                >
                  <Text
                    style={[
                      styles.presetText,
                      duration === time && styles.presetTextActive,
                    ]}
                  >
                    {time}m
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Controls */}
          <View style={styles.controls}>
            {isActive && (
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleReset}
                testID="reset-timer"
              >
                <RotateCcw size={24} color="#FFFFFF" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.playButton}
              onPress={() => setIsActive(!isActive)}
              testID="toggle-timer"
            >
              {isActive ? (
                <Pause size={32} color="#FFFFFF" />
              ) : (
                <Play size={32} color="#FFFFFF" style={{ marginLeft: 4 }} />
              )}
            </TouchableOpacity>

            {isActive && <View style={styles.spacer} />}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 40,
  },
  timerContainer: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  timerText: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  adjustButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  durationDisplay: {
    marginHorizontal: 30,
    alignItems: "center",
  },
  durationValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  durationLabel: {
    fontSize: 14,
    color: "#E9D5FF",
  },
  presetsContainer: {
    maxHeight: 50,
    marginBottom: 30,
  },
  presetsContent: {
    paddingHorizontal: 10,
  },
  presetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 5,
  },
  presetButtonActive: {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  presetText: {
    color: "#E9D5FF",
    fontSize: 14,
  },
  presetTextActive: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  resetButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  spacer: {
    width: 50,
  },
});