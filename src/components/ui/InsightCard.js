// src/components/ui/InsightCard.js
import React from 'react';
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

const InsightCard = ({ 
  title, 
  insight, 
  icon = "✨", 
  type = "default",
  onPress,
  animationDelay = 0 
}) => {
  const getGradientColors = () => {
    switch (type) {
      case 'strength':
        return [colors.success, '#059669'];
      case 'trigger':
        return [colors.warning, '#D97706'];
      case 'suggestion':
        return [colors.primary, colors.primaryDark];
      default:
        return [colors.surface, colors.surfaceLight];
    }
  };

  const getIconForType = () => {
    switch (type) {
      case 'strength':
        return "💪";
      case 'trigger':
        return "⚠️";
      case 'suggestion':
        return "💡";
      case 'pattern':
        return "🔍";
      default:
        return icon;
    }
  };

  return (
    <Animatable.View
      animation="fadeInUp"
      delay={animationDelay}
      duration={600}
      style={styles.container}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <LinearGradient
          colors={getGradientColors()}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.header}>
            <Text style={styles.icon}>{getIconForType()}</Text>
            <Text style={styles.title}>{title}</Text>
          </View>
          
          <Text style={styles.insight}>{insight}</Text>
          
          {type === 'default' && (
            <View style={styles.tapHint}>
              <Text style={styles.tapHintText}>Tap to explore →</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
  },
  card: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    minHeight: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  icon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    flex: 1,
  },
  insight: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  tapHint: {
    alignSelf: 'flex-end',
  },
  tapHintText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});

export default InsightCard;