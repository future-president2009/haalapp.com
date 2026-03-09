// src/components/ui/PersonalityResult.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';

const PersonalityResult = ({ personalityType, description }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animatable.View animation="zoomIn" duration={800} style={styles.headerContainer}>
        <Text style={styles.congratsText}>✨ Your Personality Discovered ✨</Text>
        
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.typeContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.personalityType}>{personalityType}</Text>
        </LinearGradient>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={400} duration={600}>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{description.description}</Text>
        </View>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={600} duration={600}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Your Strengths</Text>
          {description.strengths.map((strength, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bulletPoint}>💫</Text>
              <Text style={styles.listText}>{strength}</Text>
            </View>
          ))}
        </View>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={800} duration={600}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Growth Areas</Text>
          {description.growthAreas.map((area, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bulletPoint}>🌱</Text>
              <Text style={styles.listText}>{area}</Text>
            </View>
          ))}
        </View>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={1000} duration={600}>
        <View style={styles.insightContainer}>
          <LinearGradient
            colors={[colors.surface, colors.surfaceLight]}
            style={styles.insightBox}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.insightTitle}>🔮 What's Next?</Text>
            <Text style={styles.insightText}>
              In 7 days, we'll have enough data to show you patterns about yourself 
              you never noticed. Your personality type will evolve as we learn more about you!
            </Text>
          </LinearGradient>
        </View>
      </Animatable.View>

      <View style={styles.spacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  congratsText: {
    ...typography.h3,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  typeContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  personalityType: {
    ...typography.h1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  descriptionText: {
    ...typography.body,
    lineHeight: 24,
    textAlign: 'center',
  },
  sectionContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
    color: colors.primary,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingLeft: spacing.sm,
  },
  bulletPoint: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  listText: {
    ...typography.body,
    flex: 1,
    lineHeight: 22,
  },
  insightContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  insightBox: {
    padding: spacing.lg,
    borderRadius: 12,
  },
  insightTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  insightText: {
    ...typography.bodySecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  spacer: {
    height: spacing.xl,
  },
});

export default PersonalityResult;