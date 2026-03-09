// src/components/ui/InteractiveCopingTool.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';

const { width } = Dimensions.get('window');

const InteractiveCopingTool = ({ tool, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [breathAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (tool.id === 'box_breathing' && isActive) {
      startBreathingAnimation();
    }
  }, [isActive]);

  const startBreathingAnimation = () => {
    const breathingCycle = () => {
      Animated.sequence([
        // Inhale (4 seconds)
        Animated.timing(breathAnimation, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        // Hold (4 seconds) - no animation change
        Animated.delay(4000),
        // Exhale (4 seconds)
        Animated.timing(breathAnimation, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
        // Hold (4 seconds)
        Animated.delay(4000),
      ]).start(() => {
        if (isActive) {
          breathingCycle(); // Repeat
        }
      });
    };
    breathingCycle();
  };

  const renderBoxBreathing = () => {
    const scale = breathAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1.2],
    });

    const getBreathingText = () => {
      // This would be more sophisticated with proper timing
      const phases = ['Breathe in...', 'Hold...', 'Breathe out...', 'Hold...'];
      return phases[currentStep % 4];
    };

    return (
      <View style={styles.breathingContainer}>
        <Text style={styles.instructionTitle}>Box Breathing</Text>
        <Text style={styles.instructionSubtitle}>Follow the circle and text prompts</Text>
        
        <View style={styles.breathingCircleContainer}>
          <Animated.View style={[styles.breathingCircle, { transform: [{ scale }] }]}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.breathingGradient}
            >
              <Text style={styles.breathingText}>{getBreathingText()}</Text>
            </LinearGradient>
          </Animated.View>
        </View>

        <View style={styles.breathingInstructions}>
          <Text style={styles.stepText}>1. Breathe in for 4 seconds</Text>
          <Text style={styles.stepText}>2. Hold for 4 seconds</Text>
          <Text style={styles.stepText}>3. Breathe out for 4 seconds</Text>
          <Text style={styles.stepText}>4. Hold for 4 seconds</Text>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => setIsActive(!isActive)}
        >
          <Text style={styles.startButtonText}>
            {isActive ? 'Stop' : 'Start'} Breathing Exercise
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderGrounding54321 = () => {
    const steps = [
      { step: 1, instruction: "Name 5 things you can SEE around you", emoji: "👀", items: 5 },
      { step: 2, instruction: "Name 4 things you can TOUCH", emoji: "✋", items: 4 },
      { step: 3, instruction: "Name 3 things you can HEAR", emoji: "👂", items: 3 },
      { step: 4, instruction: "Name 2 things you can SMELL", emoji: "👃", items: 2 },
      { step: 5, instruction: "Name 1 thing you can TASTE", emoji: "👅", items: 1 },
    ];

    const currentStepData = steps[currentStep];

    return (
      <View style={styles.groundingContainer}>
        <Text style={styles.instructionTitle}>5-4-3-2-1 Grounding</Text>
        <Text style={styles.instructionSubtitle}>This helps bring you back to the present moment</Text>
        
        <View style={styles.stepProgress}>
          <Text style={styles.stepCounter}>Step {currentStep + 1} of 5</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${((currentStep + 1) / 5) * 100}%` }]} />
          </View>
        </View>

        <Animatable.View key={currentStep} animation="fadeInUp" style={styles.stepContainer}>
          <Text style={styles.stepEmoji}>{currentStepData.emoji}</Text>
          <Text style={styles.stepInstruction}>{currentStepData.instruction}</Text>
          
          <Text style={styles.stepDetail}>
            Take your time and really focus on each one.
          </Text>
        </Animatable.View>

        <View style={styles.navigationButtons}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => setCurrentStep(currentStep - 1)}
            >
              <Text style={styles.navButtonText}>← Previous</Text>
            </TouchableOpacity>
          )}
          
          {currentStep < 4 ? (
            <TouchableOpacity
              style={[styles.navButton, styles.nextButton]}
              onPress={() => setCurrentStep(currentStep + 1)}
            >
              <Text style={styles.navButtonText}>Next →</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navButton, styles.completeButton]}
              onPress={() => {
                // Show completion message
                setCurrentStep(5);
              }}
            >
              <Text style={styles.navButtonText}>Complete ✓</Text>
            </TouchableOpacity>
          )}
        </View>

        {currentStep === 5 && (
          <Animatable.View animation="bounceIn" style={styles.completionMessage}>
            <Text style={styles.completionEmoji}>🎉</Text>
            <Text style={styles.completionText}>Great job! How do you feel now?</Text>
            <TouchableOpacity style={styles.restartButton} onPress={() => setCurrentStep(0)}>
              <Text style={styles.restartButtonText}>Try Again</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}
      </View>
    );
  };

  const renderFamilySupport = () => {
    const familyTips = [
      {
        situation: "Parents don't understand",
        tips: [
          "Try explaining how you feel using specific examples",
          "Ask them to listen without trying to fix everything",
          "Suggest doing something together that you both enjoy",
          "Write a letter if talking feels too hard"
        ]
      },
      {
        situation: "Family arguments",
        tips: [
          "Take a break if things get heated",
          "Use 'I feel...' statements instead of 'You always...'",
          "Ask for a family meeting when everyone is calm",
          "Remember that disagreeing doesn't mean they don't love you"
        ]
      },
      {
        situation: "Feeling misunderstood",
        tips: [
          "Share something you're interested in with them",
          "Ask them about their own teenage experiences",
          "Be patient - it takes time to build understanding",
          "Consider family counseling if things feel really stuck"
        ]
      }
    ];

    return (
      <View style={styles.familyContainer}>
        <Text style={styles.instructionTitle}>Family Support Strategies</Text>
        <Text style={styles.instructionSubtitle}>Ways to improve communication and connection</Text>
        
        {familyTips.map((section, index) => (
          <Animatable.View 
            key={index}
            animation="fadeInUp"
            delay={index * 200}
            style={styles.familySection}
          >
            <Text style={styles.familySituation}>{section.situation}</Text>
            {section.tips.map((tip, tipIndex) => (
              <View key={tipIndex} style={styles.tipContainer}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </Animatable.View>
        ))}
      </View>
    );
  };

  const renderContent = () => {
    switch (tool.id) {
      case 'box_breathing':
        return renderBoxBreathing();
      case 'grounding_54321':
        return renderGrounding54321();
      case 'family_support':
        return renderFamilySupport();
      default:
        return (
          <View style={styles.defaultContainer}>
            <Text style={styles.instructionTitle}>{tool.title}</Text>
            <Text style={styles.instructionText}>{tool.description}</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.overlay}>
      <Animatable.View animation="slideInUp" duration={400} style={styles.container}>
        <LinearGradient
          colors={[colors.surface, colors.surfaceLight]}
          style={styles.modal}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          {renderContent()}
        </LinearGradient>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    zIndex: 1000,
  },
  container: {
    margin: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  modal: {
    padding: spacing.lg,
    minHeight: 400,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 1001,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructionTitle: {
    ...typography.h2,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  instructionSubtitle: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  // Breathing exercise styles
  breathingContainer: {
    alignItems: 'center',
  },
  breathingCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    marginVertical: spacing.lg,
  },
  breathingCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
  },
  breathingGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
  breathingInstructions: {
    marginBottom: spacing.lg,
  },
  stepText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  startButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },
  // Grounding exercise styles
  groundingContainer: {
    flex: 1,
  },
  stepProgress: {
    marginBottom: spacing.lg,
  },
  stepCounter: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.background,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  stepContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  stepEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  stepInstruction: {
    ...typography.h3,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  stepDetail: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  navButton: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  nextButton: {
    backgroundColor: colors.primary,
  },
  completeButton: {
    backgroundColor: colors.success,
  },
  navButtonText: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.textPrimary,
    fontWeight: '600',
  },
  completionMessage: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  completionEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  completionText: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  restartButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  restartButtonText: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  // Family support styles
  familyContainer: {
    flex: 1,
  },
  familySection: {
    marginBottom: spacing.lg,
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
  },
  familySituation: {
    ...typography.h3,
    marginBottom: spacing.sm,
    color: colors.primary,
  },
  tipContainer: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
    alignItems: 'flex-start',
  },
  tipBullet: {
    ...typography.body,
    color: colors.textSecondary,
    marginRight: spacing.sm,
    marginTop: 2,
  },
  tipText: {
    ...typography.caption,
    flex: 1,
    lineHeight: 18,
  },
  // Default styles
  defaultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  instructionText: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default InteractiveCopingTool;