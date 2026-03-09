// src/components/ui/ContactCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing } from '../../styles/theme';

// Define borderRadius locally
const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

const ContactCard = ({ contact, onEdit, onDelete, onContact }) => {
  const getRelationshipEmoji = (relationship) => {
    const emojis = {
      'family': '👨‍👩‍👧‍👦',
      'friend': '👥',
      'mentor': '🎯',
      'counselor': '🧠',
      'teacher': '📚',
      'other': '💫'
    };
    return emojis[relationship] || '💫';
  };

  const handleContact = () => {
    Alert.alert(
      `Contact ${contact.name}?`,
      `This will ${contact.phone ? 'call' : 'reach out to'} ${contact.name}. Are you sure?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: contact.phone ? 'Call' : 'Contact', 
          onPress: () => {
            onContact(contact);
          }
        }
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Remove Contact',
      `Are you sure you want to remove ${contact.name} from your safety squad?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => onDelete(contact.id) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.surface, colors.surfaceLight]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{getRelationshipEmoji(contact.relationship)}</Text>
          </View>
          
          <View style={styles.info}>
            <Text style={styles.name}>{contact.name}</Text>
            <Text style={styles.relationship}>{contact.relationship}</Text>
            {contact.phone && (
              <Text style={styles.phone}>{contact.phone}</Text>
            )}
          </View>
        </View>

        {contact.note && (
          <View style={styles.noteContainer}>
            <Text style={styles.note}>"{contact.note}"</Text>
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleContact}>
            <Text style={styles.actionButtonText}>Contact</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(contact)}>
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete}>
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Remove</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatar: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.h3,
    marginBottom: spacing.xs,
  },
  relationship: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'capitalize',
    marginBottom: spacing.xs,
  },
  phone: {
    ...typography.caption,
    color: colors.textMuted,
  },
  noteContainer: {
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  note: {
    ...typography.caption,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  actionButtonText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  deleteButtonText: {
    color: colors.textPrimary,
  },
});

export default ContactCard;