// src/components/ui/Card.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing } from '../../styles/theme';

const Card = ({ children, style, variant = 'default' }) => {
  const getCardStyle = () => {
    const baseStyle = [styles.card];
    
    if (variant === 'elevated') {
      baseStyle.push(styles.cardElevated);
    }
    
    if (variant === 'bordered') {
      baseStyle.push(styles.cardBordered);
    }
    
    return baseStyle;
  };

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
  },
  cardElevated: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardBordered: {
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
});

export default Card;