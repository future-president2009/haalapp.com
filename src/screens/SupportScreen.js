// src/screens/SupportScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import ContactCard from '../components/ui/ContactCard';
import AddContactForm from '../components/ui/AddContactForm';
import Button from '../components/ui/Button';
// import InteractiveCopingTool from '../components/ui/InteractiveCopingTool';
import useUserStore from '../store/userStore';
import { CRISIS_HOTLINES, COPING_STRATEGIES } from '../data/crisisResources';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

const SupportScreen = () => {
  const [showAddContact, setShowAddContact] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [activeTab, setActiveTab] = useState('contacts'); // 'contacts', 'crisis', 'coping'
  const [selectedCopingTool, setSelectedCopingTool] = useState(null);
  
  const { user, addTrustedContact, removeTrustedContact, updateTrustedContact } = useUserStore();

  const handleAddContact = (contactData) => {
    if (editingContact) {
      updateTrustedContact(contactData);
      setEditingContact(null);
    } else {
      addTrustedContact(contactData);
    }
    setShowAddContact(false);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setShowAddContact(true);
  };

  const handleDeleteContact = (contactId) => {
    removeTrustedContact(contactId);
  };

  const handleContactPerson = async (contact) => {
    if (contact.phone) {
      try {
        await Linking.openURL(`tel:${contact.phone.replace(/\D/g, '')}`);
      } catch (error) {
        Alert.alert('Error', 'Unable to make phone call');
      }
    } else {
      Alert.alert('Contact Info', `Reach out to ${contact.name} through your usual method of communication.`);
    }
  };

  const handleCallCrisisLine = async (resource) => {
    try {
      if (resource.textCode) {
        Alert.alert(
          resource.name,
          `Text "${resource.textCode}" to ${resource.phone}`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Messages', 
              onPress: () => Linking.openURL(`sms:${resource.phone}&body=${resource.textCode}`) 
            }
          ]
        );
      } else {
        await Linking.openURL(`tel:${resource.phone.replace(/\D/g, '')}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to contact crisis line');
    }
  };

  const renderContactsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Safety Squad</Text>
        <Text style={styles.sectionSubtitle}>
          People you trust who can support you when things get tough
        </Text>
      </View>

      {user.trustedContacts && user.trustedContacts.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {user.trustedContacts.map((contact, index) => (
            <Animatable.View
              key={contact.id}
              animation="fadeInUp"
              delay={index * 100}
              duration={400}
            >
              <ContactCard
                contact={contact}
                onEdit={handleEditContact}
                onDelete={handleDeleteContact}
                onContact={handleContactPerson}
              />
            </Animatable.View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateEmoji}>👥</Text>
          <Text style={styles.emptyStateTitle}>No contacts yet</Text>
          <Text style={styles.emptyStateText}>
            Add people you trust to your safety support network
          </Text>
        </View>
      )}

      <Button
        title="+ Add Trusted Contact"
        onPress={() => setShowAddContact(true)}
        style={styles.addButton}
      />
    </View>
  );

  const renderCrisisTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Crisis Support</Text>
        <Text style={styles.sectionSubtitle}>
          Professional help available 24/7
        </Text>
      </View>

      {CRISIS_HOTLINES.map((resource, index) => (
        <Animatable.View
          key={resource.id}
          animation="fadeInUp"
          delay={index * 100}
          duration={400}
        >
          <TouchableOpacity
            style={styles.resourceCard}
            onPress={() => handleCallCrisisLine(resource)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.surface, colors.surfaceLight]}
              style={styles.resourceGradient}
            >
              <View style={styles.resourceHeader}>
                <Text style={styles.resourceName}>{resource.name}</Text>
                <Text style={styles.resourcePhone}>{resource.phone}</Text>
              </View>
              
              <Text style={styles.resourceDescription}>{resource.description}</Text>
              
              <View style={styles.resourceFooter}>
                <Text style={styles.resourceAvailability}>{resource.availability}</Text>
                <Text style={styles.resourceAction}>Tap to contact →</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
      ))}
    </ScrollView>
  );

  const renderCopingTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Coping Strategies</Text>
        <Text style={styles.sectionSubtitle}>
          Tools to help you through difficult moments
        </Text>
      </View>

      {COPING_STRATEGIES.map((strategy, index) => (
        <Animatable.View
          key={strategy.id}
          animation="fadeInUp"
          delay={index * 100}
          duration={400}
        >
          <TouchableOpacity
            style={styles.strategyCard}
            onPress={() => {
              // setSelectedCopingTool(strategy)
              Alert.alert('Coming Soon', 'Interactive coping tools will be available in the next update!');
            }}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.surface, colors.surfaceLight]}
              style={styles.strategyGradient}
            >
              <Text style={styles.strategyTitle}>{strategy.title}</Text>
              <Text style={styles.strategyDescription}>{strategy.description}</Text>
              <View style={styles.strategyMeta}>
                <Text style={styles.strategyTime}>⏱️ {strategy.timeNeeded}</Text>
                <Text style={styles.strategyCategory}>#{strategy.category}</Text>
                <Text style={styles.strategyAction}>Tap to try →</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.background, colors.surface]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Support Network</Text>
          <Text style={styles.headerSubtitle}>Your safety and wellbeing resources</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {[
            { id: 'contacts', label: 'My People' },
            { id: 'crisis', label: 'Crisis Help' },
            { id: 'coping', label: 'Coping Tools' }
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'contacts' && renderContactsTab()}
        {activeTab === 'crisis' && renderCrisisTab()}
        {activeTab === 'coping' && renderCopingTab()}

        {/* Add Contact Modal */}
        {showAddContact && (
          <AddContactForm
            onSubmit={handleAddContact}
            onCancel={() => {
              setShowAddContact(false);
              setEditingContact(null);
            }}
            editingContact={editingContact}
          />
        )}

        {/* Interactive Coping Tool Modal */}
        {/* {selectedCopingTool && (
          <InteractiveCopingTool
            tool={selectedCopingTool}
            onClose={() => setSelectedCopingTool(null)}
          />
        )} */}
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
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.bodySecondary,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: spacing.xs,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.textPrimary,
  },
  tabContent: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyStateTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    ...typography.bodySecondary,
    textAlign: 'center',
  },
  addButton: {
    margin: spacing.lg,
  },
  resourceCard: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  resourceGradient: {
    padding: spacing.lg,
  },
  resourceHeader: {
    marginBottom: spacing.sm,
  },
  resourceName: {
    ...typography.h3,
    marginBottom: spacing.xs,
  },
  resourcePhone: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  resourceDescription: {
    ...typography.body,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  resourceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resourceAvailability: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  resourceAction: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  strategyCard: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  strategyGradient: {
    padding: spacing.lg,
  },
  strategyTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  strategyDescription: {
    ...typography.body,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  strategyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  strategyTime: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  strategyCategory: {
    ...typography.caption,
    color: colors.primary,
  },
  strategyAction: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
  },
});

export default SupportScreen;