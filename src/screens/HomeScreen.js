// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import InsightCard from '../components/ui/InsightCard';
import QuickMoodInput from '../components/ui/QuickMoodInput';
import useUserStore from '../store/userStore';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

// Daily "Why do I..." lessons
const DAILY_LESSONS = [
  {
    title: "Why do I feel different around different people?",
    content: "It's called 'social mirroring' - you naturally adapt your energy to match the people around you. This is actually a sign of emotional intelligence!",
    type: "psychology"
  },
  {
    title: "Why do I overthink text messages?",
    content: "Your brain is trying to read tone through text, which is impossible! This creates uncertainty, and your mind fills in gaps - often negatively.",
    type: "psychology"
  },
  {
    title: "Why do I procrastinate on things I want to do?",
    content: "Sometimes we avoid good things because we're afraid of not doing them perfectly. Your brain chooses the certainty of 'not started' over the risk of 'not perfect.'",
    type: "psychology"
  },
  {
    title: "Why do I feel worse after social media?",
    content: "You're comparing your behind-the-scenes to everyone else's highlight reel. Plus, passive scrolling doesn't give you the dopamine hit of real connection.",
    type: "psychology"
  },
  {
    title: "Why do I get anxious about things that might never happen?",
    content: "Your brain's job is to keep you safe, so it scans for threats constantly. Anxiety is just your brain practicing for problems - even imaginary ones!",
    type: "psychology"
  }
];

const HomeScreen = () => {
  const [showMoodInput, setShowMoodInput] = useState(false);
  const [todaysLesson] = useState(
    DAILY_LESSONS[Math.floor(Math.random() * DAILY_LESSONS.length)]
  );
  
  const { 
    user, 
    patterns, 
    moodEntries, 
    addMoodEntry 
  } = useUserStore();

  const formatGreeting = () => {
    const hour = new Date().getHours();
    const name = user.personalityType?.split(' ')[0] || 'there';
    
    if (hour < 12) return `Good morning, ${name}!`;
    if (hour < 17) return `Hey ${name}!`;
    return `Good evening, ${name}!`;
  };

  const getTodaysInsight = () => {
    if (moodEntries.length === 0) {
      return "Ready to start tracking your patterns? Your first mood check-in will begin building your personal insights!";
    }
    
    if (moodEntries.length < 3) {
      return `You've logged ${moodEntries.length} mood${moodEntries.length > 1 ? 's' : ''}. After 3 entries, I'll start showing you patterns about yourself!`;
    }
    
    const recent = moodEntries.slice(-3);
    const avg = recent.reduce((sum, entry) => sum + entry.mood, 0) / recent.length;
    
    if (avg > 7) {
      return "Your energy has been really strong lately! You're averaging " + avg.toFixed(1) + "/10 over your last few check-ins.";
    } else if (avg < 4) {
      return "Things have been tough recently. You're not alone in this - your patterns show you've gotten through difficult times before.";
    }
    
    return "Your mood has been pretty steady. Consistency can be a strength, especially during uncertain times.";
  };

  const handleMoodSubmit = (mood, activities) => {
    addMoodEntry(mood, activities);
    setShowMoodInput(false);
  };

  const getLastMoodEntry = () => {
    if (moodEntries.length === 0) return null;
    return moodEntries[moodEntries.length - 1];
  };

  const shouldShowMoodPrompt = () => {
    const lastEntry = getLastMoodEntry();
    if (!lastEntry) return true;
    
    const hoursSinceLastEntry = (Date.now() - new Date(lastEntry.timestamp).getTime()) / (1000 * 60 * 60);
    return hoursSinceLastEntry > 4; // Prompt if it's been more than 4 hours (allow multiple per day)
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.background, colors.surface]}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animatable.View animation="fadeInDown" duration={600} style={styles.header}>
            <Text style={styles.greeting}>{formatGreeting()}</Text>
            <Text style={styles.subtitle}>
              {shouldShowMoodPrompt() ? "How's your energy today?" : "Here's what I'm noticing about you"}
            </Text>
          </Animatable.View>

          {/* Quick Mood Check */}
          {shouldShowMoodPrompt() && (
            <Animatable.View animation="fadeInUp" delay={200} duration={600}>
              <TouchableOpacity
                style={styles.moodPrompt}
                onPress={() => setShowMoodInput(true)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={styles.moodPromptGradient}
                >
                  <Text style={styles.moodPromptIcon}>📊</Text>
                  <View style={styles.moodPromptText}>
                    <Text style={styles.moodPromptTitle}>Quick Mood Check</Text>
                    <Text style={styles.moodPromptSubtitle}>2-second check-in to track your patterns</Text>
                  </View>
                  <Text style={styles.moodPromptArrow}>→</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animatable.View>
          )}

          {/* Today's Insight */}
          <InsightCard
            title="Today's Insight"
            insight={getTodaysInsight()}
            icon="🔮"
            animationDelay={300}
          />

          {/* Daily Psychology Lesson */}
          <InsightCard
            title="Why Do I...?"
            insight={todaysLesson.content}
            type="pattern"
            animationDelay={400}
          />

          {/* Pattern Insights */}
          {patterns.weeklyInsights.length > 0 && (
            <InsightCard
              title="Weekly Pattern"
              insight={patterns.weeklyInsights[0]}
              type="strength"
              animationDelay={500}
            />
          )}

          {patterns.strengths.length > 0 && (
            <InsightCard
              title="Your Strength"
              insight={patterns.strengths[0]}
              type="strength"
              animationDelay={600}
            />
          )}

          {patterns.triggers.length > 0 && (
            <InsightCard
              title="Pattern Notice"
              insight={patterns.triggers[0]}
              type="trigger"
              animationDelay={700}
            />
          )}

          {patterns.suggestions.length > 0 && (
            <InsightCard
              title="Suggestion"
              insight={patterns.suggestions[0]}
              type="suggestion"
              animationDelay={800}
            />
          )}

          {/* Weekly Challenge */}
          <InsightCard
            title="Weekly Challenge"
            insight="Try the '5-4-3-2-1 grounding technique' when you feel anxious. Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste."
            icon="🎯"
            type="suggestion"
            animationDelay={900}
          />

          {/* Spacer for bottom navigation */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Mood Input Modal */}
        {showMoodInput && (
          <QuickMoodInput
            onMoodSubmit={handleMoodSubmit}
            onCancel={() => setShowMoodInput(false)}
          />
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  greeting: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodySecondary,
    lineHeight: 22,
  },
  moodPrompt: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  moodPromptGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  moodPromptIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  moodPromptText: {
    flex: 1,
  },
  moodPromptTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  moodPromptSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  moodPromptArrow: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});

export default HomeScreen;