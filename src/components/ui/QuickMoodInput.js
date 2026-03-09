// src/components/ui/QuickMoodInput.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { colors, typography, spacing } from '../../styles/theme';

// Define borderRadius locally
const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

const MOOD_OPTIONS = [
  { value: 9, emoji: "😊", label: "Great" },
  { value: 7, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😐", label: "Okay" },
  { value: 3, emoji: "😔", label: "Low" },
  { value: 1, emoji: "😰", label: "Rough" }
];

const ACTIVITY_OPTIONS = [
  "School/Work", "Friends", "Family", "Exercise", 
  "Creative", "Nature", "Gaming", "Music", "Reading"
];

const QuickMoodInput = ({ onMoodSubmit, onCancel }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [step, setStep] = useState('mood'); // 'mood' or 'activities'

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setStep('activities');
  };

  const toggleActivity = (activity) => {
    setSelectedActivities(prev => 
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const handleSubmit = () => {
    onMoodSubmit(selectedMood.value, selectedActivities);
  };

  if (step === 'mood') {
    return (
      <Animatable.View animation="slideInUp" duration={400} style={styles.container}>
        <LinearGradient
          colors={[colors.surface, colors.surfaceLight]}
          style={styles.card}
        >
          <Text style={styles.title}>How's your energy right now?</Text>
          
          <View style={styles.moodGrid}>
            {MOOD_OPTIONS.map((mood, index) => (
              <Animatable.View
                key={mood.value}
                animation="bounceIn"
                delay={index * 100}
                duration={500}
              >
                <TouchableOpacity
                  style={styles.moodOption}
                  onPress={() => handleMoodSelect(mood)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodLabel}>{mood.label}</Text>
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </View>
          
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelText}>Maybe later</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animatable.View>
    );
  }

  return (
    <Animatable.View animation="slideInRight" duration={400} style={styles.container}>
      <LinearGradient
        colors={[colors.surface, colors.surfaceLight]}
        style={styles.card}
      >
        <Text style={styles.title}>What's been part of your day?</Text>
        <Text style={styles.subtitle}>Select any that apply (optional)</Text>
        
        <View style={styles.activityGrid}>
          {ACTIVITY_OPTIONS.map((activity, index) => (
            <TouchableOpacity
              key={activity}
              style={[
                styles.activityChip,
                selectedActivities.includes(activity) && styles.activityChipSelected
              ]}
              onPress={() => toggleActivity(activity)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.activityText,
                  selectedActivities.includes(activity) && styles.activityTextSelected
                ]}
              >
                {activity}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => setStep('mood')}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.submitGradient}
            >
              <Text style={styles.submitText}>Done ✨</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  card: {
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    maxHeight: '80%',
  },
  title: {
    ...typography.h3,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.caption,
    textAlign: 'center',
    marginBottom: spacing.lg,
    color: colors.textSecondary,
  },
  moodGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  moodOption: {
    alignItems: 'center',
    padding: spacing.sm,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  moodLabel: {
    ...typography.caption,
    textAlign: 'center',
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  activityChip: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginBottom: spacing.xs,
    minWidth: '30%',
    alignItems: 'center',
  },
  activityChipSelected: {
    backgroundColor: colors.primary,
  },
  activityText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  activityTextSelected: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: spacing.sm,
  },
  backText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitGradient: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  submitText: {
    ...typography.button,
    color: colors.textPrimary,
  },
  cancelButton: {
    alignItems: 'center',
    padding: spacing.sm,
  },
  cancelText: {
    ...typography.body,
    color: colors.textMuted,
  },
});

export default QuickMoodInput;