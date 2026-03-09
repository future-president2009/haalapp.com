// src/components/ui/QuizCard.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';

const QuizCard = ({ question, options, onAnswer, questionNumber, totalQuestions }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
    // Small delay for visual feedback, then call onAnswer
    setTimeout(() => {
      onAnswer(optionId);
    }, 200);
  };

  return (
    <Animatable.View animation="fadeInUp" duration={600} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.questionNumber}>
          {questionNumber} of {totalQuestions}
        </Text>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={[styles.progress, { width: `${(questionNumber / totalQuestions) * 100}%` }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <Animatable.View
            key={option.id}
            animation="fadeInUp"
            delay={index * 100}
            duration={400}
          >
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedOption === option.id && styles.optionButtonSelected
              ]}
              onPress={() => handleOptionSelect(option.id)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  selectedOption === option.id
                    ? [colors.primary, colors.primaryDark]
                    : [colors.surface, colors.surfaceLight]
                }
                style={styles.optionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedOption === option.id && styles.optionTextSelected
                  ]}
                >
                  {option.text}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  questionNumber: {
    ...typography.caption,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  questionContainer: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  questionText: {
    ...typography.h2,
    textAlign: 'center',
    lineHeight: 32,
  },
  optionsContainer: {
    flex: 1,
  },
  optionButton: {
    marginBottom: spacing.md,
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionButtonSelected: {
    transform: [{ scale: 0.98 }],
  },
  optionGradient: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    minHeight: 64,
    justifyContent: 'center',
  },
  optionText: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 22,
  },
  optionTextSelected: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
});

export default QuizCard;