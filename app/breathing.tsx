import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { X, Play, Pause, RotateCcw } from "lucide-react-native";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const BREATHING_PATTERNS = {
  "4-7-8": { inhale: 4, hold: 7, exhale: 8, name: "4-7-8 Relaxation" },
  "box": { inhale: 4, hold: 4, exhale: 4, name: "Box Breathing" },
  "calm": { inhale: 5, hold: 0, exhale: 5, name: "Calm Breathing" },
};

export default function BreathingScreen() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [pattern, setPattern] = useState<keyof typeof BREATHING_PATTERNS>("4-7-8");
  const [cycles, setCycles] = useState(0);
  
  const scaleAnimation = useRef(new Animated.Value(0.5)).current;
  const opacityAnimation = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (isActive) {
      const currentPattern = BREATHING_PATTERNS[pattern];
      let currentPhase: "inhale" | "hold" | "exhale" = "inhale";
      
      const runBreathingCycle = () => {
        // Inhale
        Animated.parallel([
          Animated.timing(scaleAnimation, {
            toValue: 1,
            duration: currentPattern.inhale * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnimation, {
            toValue: 0.8,
            duration: currentPattern.inhale * 1000,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (!isActive) return;
          
          // Hold
          if (currentPattern.hold > 0) {
            setPhase("hold");
            setTimeout(() => {
              if (!isActive) return;
              
              // Exhale
              setPhase("exhale");
              Animated.parallel([
                Animated.timing(scaleAnimation, {
                  toValue: 0.5,
                  duration: currentPattern.exhale * 1000,
                  useNativeDriver: true,
                }),
                Animated.timing(opacityAnimation, {
                  toValue: 0.3,
                  duration: currentPattern.exhale * 1000,
                  useNativeDriver: true,
                }),
              ]).start(() => {
                if (!isActive) return;
                setCycles(prev => prev + 1);
                setPhase("inhale");
                runBreathingCycle();
              });
            }, currentPattern.hold * 1000);
          } else {
            // No hold, go straight to exhale
            setPhase("exhale");
            Animated.parallel([
              Animated.timing(scaleAnimation, {
                toValue: 0.5,
                duration: currentPattern.exhale * 1000,
                useNativeDriver: true,
              }),
              Animated.timing(opacityAnimation, {
                toValue: 0.3,
                duration: currentPattern.exhale * 1000,
                useNativeDriver: true,
              }),
            ]).start(() => {
              if (!isActive) return;
              setCycles(prev => prev + 1);
              setPhase("inhale");
              runBreathingCycle();
            });
          }
        });
      };
      
      runBreathingCycle();
    } else {
      scaleAnimation.setValue(0.5);
      opacityAnimation.setValue(0.3);
    }
    
    return () => {
      scaleAnimation.stopAnimation();
      opacityAnimation.stopAnimation();
    };
  }, [isActive, pattern]);

  const handleReset = () => {
    setIsActive(false);
    setCycles(0);
    setPhase("inhale");
    scaleAnimation.setValue(0.5);
    opacityAnimation.setValue(0.3);
  };

  const getPhaseText = () => {
    switch (phase) {
      case "inhale": return "Breathe In";
      case "hold": return "Hold";
      case "exhale": return "Breathe Out";
    }
  };

  return (
    <LinearGradient
      colors={["#06B6D4", "#0891B2", "#0E7490"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
            testID="close-breathing"
          >
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Breathing Exercise</Text>
          
          {/* Pattern Selector */}
          <View style={styles.patternSelector}>
            {Object.entries(BREATHING_PATTERNS).map(([key, value]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.patternButton,
                  pattern === key && styles.patternButtonActive,
                ]}
                onPress={() => !isActive && setPattern(key as keyof typeof BREATHING_PATTERNS)}
                disabled={isActive}
              >
                <Text
                  style={[
                    styles.patternText,
                    pattern === key && styles.patternTextActive,
                  ]}
                >
                  {value.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Breathing Circle */}
          <View style={styles.circleContainer}>
            <Animated.View
              style={[
                styles.outerCircle,
                {
                  transform: [{ scale: scaleAnimation }],
                  opacity: opacityAnimation,
                },
              ]}
            />
            <View style={styles.innerCircle}>
              <Text style={styles.phaseText}>{getPhaseText()}</Text>
              <Text style={styles.cyclesText}>Cycles: {cycles}</Text>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
              testID="reset-breathing"
            >
              <RotateCcw size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.playButton}
              onPress={() => setIsActive(!isActive)}
              testID="toggle-breathing"
            >
              {isActive ? (
                <Pause size={32} color="#FFFFFF" />
              ) : (
                <Play size={32} color="#FFFFFF" style={{ marginLeft: 4 }} />
              )}
            </TouchableOpacity>

            <View style={styles.spacer} />
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
    marginBottom: 30,
  },
  patternSelector: {
    marginBottom: 40,
  },
  patternButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: 10,
  },
  patternButtonActive: {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  patternText: {
    color: "#E0F2FE",
    fontSize: 16,
    textAlign: "center",
  },
  patternTextActive: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  circleContainer: {
    width: width * 0.8,
    height: width * 0.8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  outerCircle: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: width * 0.4,
    backgroundColor: "#FFFFFF",
  },
  innerCircle: {
    width: "50%",
    height: "50%",
    borderRadius: width * 0.2,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  phaseText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  cyclesText: {
    fontSize: 16,
    color: "#E0F2FE",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
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