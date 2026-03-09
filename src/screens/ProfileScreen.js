// src/screens/ProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import DataExport from '../components/ui/DataExport';
import useUserStore from '../store/userStore';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

const ProfileScreen = () => {
  const [showDataExport, setShowDataExport] = useState(false);
  
  const { 
    user, 
    moodEntries, 
    chatHistory, 
    patterns,
    resetQuiz 
  } = useUserStore();

  const getStats = () => {
    const totalMoodEntries = moodEntries.length;
    const avgMood = totalMoodEntries > 0 
      ? (moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / totalMoodEntries).toFixed(1)
      : 0;
    
    const accountAge = user.createdAt 
      ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    const totalInsights = Object.values(patterns).flat().length;

    return {
      accountAge,
      totalMoodEntries,
      avgMood,
      totalInsights,
      chatMessages: chatHistory.length,
      trustedContacts: user.trustedContacts?.length || 0
    };
  };

  const handleRetakeQuiz = () => {
    Alert.alert(
      'Retake Personality Quiz',
      'This will reset your personality results. Your mood data and other information will remain unchanged.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Retake Quiz',
          onPress: () => {
            resetQuiz();
            Alert.alert('Quiz Reset', 'You can retake the personality quiz from the onboarding screen.');
          }
        }
      ]
    );
  };

  const stats = getStats();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.background, colors.surface]}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animatable.View animation="fadeInDown" duration={600} style={styles.header}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {user.personalityType?.charAt(0) || '?'}
                </Text>
              </LinearGradient>
            </View>
            
            <Text style={styles.personalityType}>
              {user.personalityType || 'Personality Unknown'}
            </Text>
            
            <Text style={styles.memberSince}>
              Member for {stats.accountAge} days
            </Text>
          </Animatable.View>

          {/* Stats Cards */}
          <Animatable.View animation="fadeInUp" delay={200} duration={600}>
            <Text style={styles.sectionTitle}>Your Journey</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={styles.statGradient}
                >
                  <Text style={styles.statNumber}>{stats.totalMoodEntries}</Text>
                  <Text style={styles.statLabel}>Mood Entries</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={[colors.secondary, '#EC4899']}
                  style={styles.statGradient}
                >
                  <Text style={styles.statNumber}>{stats.avgMood}/10</Text>
                  <Text style={styles.statLabel}>Avg Mood</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={[colors.accent, '#0891B2']}
                  style={styles.statGradient}
                >
                  <Text style={styles.statNumber}>{stats.totalInsights}</Text>
                  <Text style={styles.statLabel}>Insights</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={[colors.success, '#059669']}
                  style={styles.statGradient}
                >
                  <Text style={styles.statNumber}>{stats.trustedContacts}</Text>
                  <Text style={styles.statLabel}>Support People</Text>
                </LinearGradient>
              </View>
            </View>
          </Animatable.View>

          {/* Personality Section */}
          <Animatable.View animation="fadeInUp" delay={400} duration={600}>
            <Text style={styles.sectionTitle}>Personality</Text>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleRetakeQuiz}>
              <View style={styles.menuItemContent}>
                <View style={styles.menuItemIcon}>
                  <Text style={styles.menuItemEmoji}>🔄</Text>
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>Retake Personality Quiz</Text>
                  <Text style={styles.menuItemDescription}>
                    Update your personality type
                  </Text>
                </View>
                <Text style={styles.menuItemArrow}>→</Text>
              </View>
            </TouchableOpacity>

            {user.personalityDescription && (
              <View style={styles.personalityCard}>
                <LinearGradient
                  colors={[colors.surface, colors.surfaceLight]}
                  style={styles.personalityGradient}
                >
                  <Text style={styles.personalityTitle}>Your Type</Text>
                  <Text style={styles.personalityDescription}>
                    {user.personalityDescription.description}
                  </Text>
                </LinearGradient>
              </View>
            )}
          </Animatable.View>

          {/* Data & Privacy Section */}
          <Animatable.View animation="fadeInUp" delay={600} duration={600}>
            <Text style={styles.sectionTitle}>Data & Privacy</Text>
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => setShowDataExport(true)}
            >
              <View style={styles.menuItemContent}>
                <View style={styles.menuItemIcon}>
                  <Text style={styles.menuItemEmoji}>📊</Text>
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>Export My Data</Text>
                  <Text style={styles.menuItemDescription}>
                    Download all your HAAL data
                  </Text>
                </View>
                <Text style={styles.menuItemArrow}>→</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.privacyInfo}>
              <Text style={styles.privacyTitle}>Your Privacy Matters</Text>
              <Text style={styles.privacyText}>
                • Your data stays on your device by default{'\n'}
                • We never sell your personal information{'\n'}
                • You can export or delete your data anytime{'\n'}
                • Crisis detection helps keep you safe
              </Text>
            </View>
          </Animatable.View>

          {/* App Info */}
          <Animatable.View animation="fadeInUp" delay={800} duration={600}>
            <View style={styles.appInfo}>
              <Text style={styles.appInfoTitle}>HAAL v1.0.0</Text>
              <Text style={styles.appInfoText}>
                Built with ❤️ for teen mental health{'\n'}
                Your patterns, your insights, your growth
              </Text>
            </View>
          </Animatable.View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Data Export Modal */}
        {showDataExport && (
          <DataExport onClose={() => setShowDataExport(false)} />
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
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.h1,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  personalityType: {
    ...typography.h2,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  memberSince: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  sectionTitle: {
    ...typography.h3,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  statGradient: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  menuItem: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  menuItemIcon: {
    marginRight: spacing.md,
  },
  menuItemEmoji: {
    fontSize: 24,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  menuItemDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  menuItemArrow: {
    ...typography.h3,
    color: colors.textMuted,
  },
  personalityCard: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  personalityGradient: {
    padding: spacing.lg,
  },
  personalityTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  personalityDescription: {
    ...typography.body,
    lineHeight: 22,
  },
  privacyInfo: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  privacyTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  privacyText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  appInfo: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  appInfoTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  appInfoText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});

export default ProfileScreen;