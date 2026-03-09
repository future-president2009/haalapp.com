// src/components/ui/DataExport.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import Button from './Button';
import useUserStore from '../../store/userStore';
import { colors, typography, spacing } from '../../styles/theme';

// Define borderRadius locally
const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

const DataExport = ({ onClose }) => {
  const [selectedData, setSelectedData] = useState({
    personality: true,
    moodEntries: true,
    chatHistory: false,
    patterns: true,
    contacts: false
  });

  const { 
    user, 
    moodEntries, 
    chatHistory, 
    patterns,
    exportUserData,
    deleteAllUserData 
  } = useUserStore();

  const getDataSummary = () => {
    return {
      personalityType: user.personalityType || 'Not set',
      moodEntriesCount: moodEntries.length,
      chatMessagesCount: chatHistory.length,
      trustedContactsCount: user.trustedContacts?.length || 0,
      patternsCount: Object.values(patterns).flat().length,
      accountAge: user.createdAt ? 
        Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0
    };
  };

  const generateExportData = () => {
    const exportData = {
      exportInfo: {
        exportDate: new Date().toISOString(),
        appVersion: '1.0.0',
        dataTypes: Object.keys(selectedData).filter(key => selectedData[key])
      }
    };

    if (selectedData.personality) {
      exportData.personality = {
        type: user.personalityType,
        description: user.personalityDescription,
        quizAnswers: user.quizAnswers
      };
    }

    if (selectedData.moodEntries) {
      exportData.moodTracking = {
        entries: moodEntries,
        totalEntries: moodEntries.length,
        averageMood: moodEntries.length > 0 
          ? moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length 
          : 0
      };
    }

    if (selectedData.chatHistory) {
      exportData.chatHistory = {
        messages: chatHistory,
        totalMessages: chatHistory.length
      };
    }

    if (selectedData.patterns) {
      exportData.patterns = patterns;
    }

    if (selectedData.contacts) {
      exportData.trustedContacts = user.trustedContacts?.map(contact => ({
        name: contact.name,
        relationship: contact.relationship,
        note: contact.note,
        // Phone numbers excluded for privacy
      })) || [];
    }

    return JSON.stringify(exportData, null, 2);
  };

  const handleExport = async () => {
    try {
      const exportedData = generateExportData();
      const fileName = `HAAL_Data_Export_${new Date().toISOString().split('T')[0]}.json`;
      
      await Share.share({
        message: exportedData,
        title: 'HAAL Data Export',
      });
    } catch (error) {
      Alert.alert('Export Error', 'Unable to export data. Please try again.');
    }
  };

  const handleDeleteAllData = () => {
    Alert.alert(
      'Delete All Data',
      'This will permanently delete all your HAAL data including personality results, mood entries, chat history, and trusted contacts. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: () => {
            deleteAllUserData();
            Alert.alert('Data Deleted', 'All your data has been permanently deleted.', [
              { text: 'OK', onPress: onClose }
            ]);
          }
        }
      ]
    );
  };

  const toggleDataType = (dataType) => {
    setSelectedData(prev => ({
      ...prev,
      [dataType]: !prev[dataType]
    }));
  };

  const summary = getDataSummary();

  return (
    <View style={styles.overlay}>
      <Animatable.View animation="slideInUp" duration={400} style={styles.container}>
        <LinearGradient
          colors={[colors.surface, colors.surfaceLight]}
          style={styles.modal}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.title}>Your Data & Privacy</Text>
              <Text style={styles.subtitle}>
                Export your data or manage your privacy settings
              </Text>
            </View>

            {/* Data Summary */}
            <View style={styles.summarySection}>
              <Text style={styles.sectionTitle}>Data Summary</Text>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryNumber}>{summary.accountAge}</Text>
                  <Text style={styles.summaryLabel}>Days Active</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryNumber}>{summary.moodEntriesCount}</Text>
                  <Text style={styles.summaryLabel}>Mood Entries</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryNumber}>{summary.chatMessagesCount}</Text>
                  <Text style={styles.summaryLabel}>Chat Messages</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryNumber}>{summary.trustedContactsCount}</Text>
                  <Text style={styles.summaryLabel}>Contacts</Text>
                </View>
              </View>
            </View>

            {/* Export Options */}
            <View style={styles.exportSection}>
              <Text style={styles.sectionTitle}>Export Data</Text>
              <Text style={styles.sectionDescription}>
                Choose what data to include in your export
              </Text>

              {[
                { key: 'personality', label: 'Personality Results', description: 'Quiz answers and personality type' },
                { key: 'moodEntries', label: 'Mood Tracking', description: 'Daily mood entries and patterns' },
                { key: 'patterns', label: 'Insights & Patterns', description: 'Generated insights about your behavior' },
                { key: 'chatHistory', label: 'Chat History', description: 'Conversations with Riley (sensitive)' },
                { key: 'contacts', label: 'Trusted Contacts', description: 'Your safety network (names only)' }
              ].map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={styles.dataOption}
                  onPress={() => toggleDataType(item.key)}
                >
                  <View style={styles.dataOptionContent}>
                    <View style={styles.dataOptionText}>
                      <Text style={styles.dataOptionLabel}>{item.label}</Text>
                      <Text style={styles.dataOptionDescription}>{item.description}</Text>
                    </View>
                    <View style={[
                      styles.checkbox,
                      selectedData[item.key] && styles.checkboxSelected
                    ]}>
                      {selectedData[item.key] && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Button
                title="Export Selected Data"
                onPress={handleExport}
                style={styles.exportButton}
              />

              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={handleDeleteAllData}
              >
                <Text style={styles.deleteButtonText}>Delete All My Data</Text>
              </TouchableOpacity>

              <Button
                title="Close"
                onPress={onClose}
                variant="ghost"
                style={styles.closeButton}
              />
            </View>
          </ScrollView>
        </LinearGradient>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    zIndex: 1000,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  modal: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    maxHeight: '90%',
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
  summarySection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryNumber: {
    ...typography.h2,
    color: colors.primary,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  exportSection: {
    marginBottom: spacing.lg,
  },
  dataOption: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  dataOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  dataOptionText: {
    flex: 1,
  },
  dataOptionLabel: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  dataOptionDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  actions: {
    marginTop: spacing.lg,
  },
  exportButton: {
    marginBottom: spacing.md,
  },
  deleteButton: {
    backgroundColor: colors.error,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  deleteButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },
  closeButton: {
    marginTop: spacing.sm,
  },
});

export default DataExport;