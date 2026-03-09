// src/components/chat/ChatBubble.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

const ChatBubble = ({ message, isUser, timestamp, animationDelay = 0 }) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isUser) {
    return (
      <Animatable.View 
        animation="slideInRight" 
        duration={300}
        delay={animationDelay}
        style={styles.userBubbleContainer}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.userBubble}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.userText}>{message}</Text>
        </LinearGradient>
        <Text style={styles.timestamp}>{formatTime(timestamp)}</Text>
      </Animatable.View>
    );
  }

  return (
    <Animatable.View 
      animation="slideInLeft" 
      duration={300}
      delay={animationDelay}
      style={styles.rileyBubbleContainer}
    >
      <View style={styles.rileyHeader}>
        <View style={styles.rileyAvatar}>
          <Text style={styles.rileyAvatarText}>🤖</Text>
        </View>
        <Text style={styles.rileyName}>Riley</Text>
      </View>
      
      <View style={styles.rileyBubble}>
        <Text style={styles.rileyText}>{message}</Text>
      </View>
      
      <Text style={styles.timestamp}>{formatTime(timestamp)}</Text>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  userBubbleContainer: {
    alignItems: 'flex-end',
    marginVertical: spacing.xs,
    marginHorizontal: spacing.md,
  },
  userBubble: {
    maxWidth: '80%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderBottomRightRadius: spacing.xs,
  },
  userText: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  rileyBubbleContainer: {
    alignItems: 'flex-start',
    marginVertical: spacing.xs,
    marginHorizontal: spacing.md,
  },
  rileyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  rileyAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  rileyAvatarText: {
    fontSize: 12,
  },
  rileyName: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: '600',
  },
  rileyBubble: {
    maxWidth: '80%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderBottomLeftRadius: spacing.xs,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  rileyText: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  timestamp: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
    fontSize: 11,
  },
});

export default ChatBubble;