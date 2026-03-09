// src/components/ui/AddContactForm.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import Button from './Button';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';

const RELATIONSHIP_OPTIONS = [
  { id: 'family', label: 'Family Member', emoji: '👨‍👩‍👧‍👦' },
  { id: 'friend', label: 'Friend', emoji: '👥' },
  { id: 'mentor', label: 'Mentor/Trusted Adult', emoji: '🎯' },
  { id: 'counselor', label: 'Counselor/Therapist', emoji: '🧠' },
  { id: 'teacher', label: 'Teacher/Coach', emoji: '📚' },
  { id: 'other', label: 'Other', emoji: '💫' }
];

const AddContactForm = ({ onSubmit, onCancel, editingContact = null }) => {
  const [formData, setFormData] = useState({
    name: editingContact?.name || '',
    phone: editingContact?.phone || '',
    relationship: editingContact?.relationship || '',
    note: editingContact?.note || ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.relationship) {
      newErrors.relationship = 'Please select a relationship';
    }
    
    if (formData.phone && !formData.phone.match(/^\d{3}-?\d{3}-?\d{4}$/)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        ...formData,
        id: editingContact?.id || Date.now().toString()
      });
    }
  };

  const formatPhoneNumber = (text) => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return cleaned;
  };

  const quickAddSuggestions = [
    { name: 'Mom', relationship: 'family', emoji: '👩' },
    { name: 'Dad', relationship: 'family', emoji: '👨' },
    { name: 'Best Friend', relationship: 'friend', emoji: '👥' },
    { name: 'Sibling', relationship: 'family', emoji: '🤝' },
    { name: 'School Counselor', relationship: 'counselor', emoji: '🧠' },
    { name: 'Teacher', relationship: 'teacher', emoji: '📚' },
  ];

  const handleQuickAdd = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      name: suggestion.name,
      relationship: suggestion.relationship
    }));
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Animatable.View animation="slideInUp" duration={400} style={styles.overlay}>
        <LinearGradient
          colors={[colors.surface, colors.surfaceLight]}
          style={styles.modal}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {editingContact ? 'Edit Contact' : 'Add Trusted Contact'}
              </Text>
              <Text style={styles.subtitle}>
                This person will be part of your safety support network
              </Text>
            </View>

            {/* Quick Add Suggestions */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quick Add</Text>
              <Text style={styles.quickAddSubtitle}>Tap to quickly add common contacts</Text>
              <View style={styles.quickAddGrid}>
                {quickAddSuggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.quickAddOption}
                    onPress={() => handleQuickAdd(suggestion)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.quickAddEmoji}>{suggestion.emoji}</Text>
                    <Text style={styles.quickAddText}>{suggestion.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Manual Entry Section */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or enter manually</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Enter their name"
                placeholderTextColor={colors.textMuted}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number (Optional)</Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ 
                  ...prev, 
                  phone: formatPhoneNumber(text) 
                }))}
                placeholder="123-456-7890"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
                maxLength={12}
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            {/* Relationship Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Relationship *</Text>
              <View style={styles.relationshipGrid}>
                {RELATIONSHIP_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.relationshipOption,
                      formData.relationship === option.id && styles.relationshipOptionSelected
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, relationship: option.id }))}
                  >
                    <Text style={styles.relationshipEmoji}>{option.emoji}</Text>
                    <Text style={[
                      styles.relationshipText,
                      formData.relationship === option.id && styles.relationshipTextSelected
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.relationship && <Text style={styles.errorText}>{errors.relationship}</Text>}
            </View>

            {/* Note Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Note (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.note}
                onChangeText={(text) => setFormData(prev => ({ ...prev, note: text }))}
                placeholder="Why this person is important to you..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
                maxLength={200}
              />
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Button
                title="Cancel"
                onPress={onCancel}
                variant="ghost"
                style={styles.cancelButton}
              />
              
              <Button
                title={editingContact ? 'Update Contact' : 'Add Contact'}
                onPress={handleSubmit}
                style={styles.submitButton}
              />
            </View>
          </ScrollView>
        </LinearGradient>
      </Animatable.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    zIndex: 1000,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  modal: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  inputError: {
    borderColor: colors.error,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  relationshipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  relationshipOption: {
    width: '48%',
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  relationshipOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  relationshipEmoji: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  relationshipText: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  relationshipTextSelected: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  cancelButton: {
    flex: 1,
    marginRight: spacing.sm,
  },
  submitButton: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  quickAddGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAddOption: {
    width: '30%',
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  quickAddEmoji: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  quickAddText: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  quickAddSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.surfaceLight,
  },
  dividerText: {
    ...typography.caption,
    color: colors.textMuted,
    marginHorizontal: spacing.md,
  },
});

export default AddContactForm;