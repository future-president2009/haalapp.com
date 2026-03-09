// src/screens/OnboardingScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../components/ui/Button';
import useUserStore from '../store/userStore';
import { quizQuestions } from '../data/personalityQuiz';
import { colors, typography, spacing } from '../styles/theme';

// Simple QuizCard without borderRadius imports
const SimpleQuizCard = ({ question, options, onAnswer, questionNumber, totalQuestions }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
    setTimeout(() => {
      onAnswer(optionId);
    }, 200);
  };

  return (
    <View style={simpleStyles.container}>
      <View style={simpleStyles.header}>
        <Text style={simpleStyles.questionNumber}>
          {questionNumber} of {totalQuestions}
        </Text>
        <View style={simpleStyles.progressBar}>
          <View style={[simpleStyles.progress, { width: `${(questionNumber / totalQuestions) * 100}%` }]} />
        </View>
      </View>

      <View style={simpleStyles.questionContainer}>
        <Text style={simpleStyles.questionText}>{question}</Text>
      </View>

      <View style={simpleStyles.optionsContainer}>
        {options.map((option) => (
          <Button
            key={option.id}
            title={option.text}
            onPress={() => handleOptionSelect(option.id)}
            variant={selectedOption === option.id ? 'primary' : 'secondary'}
            style={simpleStyles.optionButton}
          />
        ))}
      </View>
    </View>
  );
};

// Simple PersonalityResult without borderRadius imports
const SimplePersonalityResult = ({ personalityType, description }) => {
  return (
    <View style={simpleStyles.container}>
      <Text style={simpleStyles.congratsText}>✨ Your Personality Discovered ✨</Text>
      
      <View style={simpleStyles.typeContainer}>
        <Text style={simpleStyles.personalityType}>{personalityType}</Text>
      </View>

      <View style={simpleStyles.descriptionContainer}>
        <Text style={simpleStyles.descriptionText}>{description.description}</Text>
      </View>

      <View style={simpleStyles.sectionContainer}>
        <Text style={simpleStyles.sectionTitle}>Your Strengths</Text>
        {description.strengths.map((strength, index) => (
          <Text key={index} style={simpleStyles.listText}>💫 {strength}</Text>
        ))}
      </View>

      <View style={simpleStyles.sectionContainer}>
        <Text style={simpleStyles.sectionTitle}>Growth Areas</Text>
        {description.growthAreas.map((area, index) => (
          <Text key={index} style={simpleStyles.listText}>🌱 {area}</Text>
        ))}
      </View>
    </View>
  );
};

const OnboardingScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState('welcome');
  
  const {
    currentQuestionIndex,
    quizAnswers,
    isQuizComplete,
    user,
    setQuizAnswer,
    nextQuestion,
    completeQuiz,
    completeOnboarding,
    loadUserData,
  } = useUserStore();

  useEffect(() => {
    checkExistingUser();
  }, []);

  const checkExistingUser = async () => {
    const userData = await loadUserData();
    if (userData && userData.hasCompletedOnboarding) {
      navigation.replace('Main');
    }
  };

  const handleGetStarted = () => {
    setCurrentStep('quiz');
  };

  const handleQuizAnswer = (optionId) => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    setQuizAnswer(currentQuestion.id, optionId);
    
    if (currentQuestionIndex < quizQuestions.length - 1) {
      nextQuestion();
    } else {
      completeQuiz();
      setCurrentStep('results');
    }
  };

  const handleContinueFromResults = () => {
    setCurrentStep('contacts');
  };

  const handleSkipContacts = () => {
    completeOnboarding();
    navigation.replace('Main');
  };

  // Welcome Screen
  if (currentStep === 'welcome') {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[colors.background, colors.surface]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Welcome to HAAL</Text>
              <Text style={styles.subtitle}>
                Ready to understand yourself better than anyone else does?
              </Text>
            </View>

            <View style={styles.featuresList}>
              <Text style={styles.feature}>✨ Discover your unique patterns</Text>
              <Text style={styles.feature}>🧠 Build emotional intelligence</Text>
              <Text style={styles.feature}>💬 Chat with Riley, your growth guide</Text>
              <Text style={styles.feature}>🛡️ Safe space with professional support</Text>
            </View>

            <View style={styles.footer}>
              <Text style={styles.disclaimer}>
                This isn't therapy - it's self-discovery with a safety net.
              </Text>
              
              <Button
                title="Start Discovery"
                onPress={handleGetStarted}
                size="large"
                style={styles.button}
              />
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Quiz Screen
  if (currentStep === 'quiz') {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[colors.background, colors.surface]}
          style={styles.gradient}
        >
          <SimpleQuizCard
            question={currentQuestion.question}
            options={currentQuestion.options}
            onAnswer={handleQuizAnswer}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={quizQuestions.length}
          />
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Results Screen
  if (currentStep === 'results') {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[colors.background, colors.surface]}
          style={styles.gradient}
        >
          <SimplePersonalityResult
            personalityType={user.personalityType}
            description={user.personalityDescription}
          />
          <View style={styles.resultFooter}>
            <Button
              title="Continue"
              onPress={handleContinueFromResults}
              size="large"
              style={styles.button}
            />
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Trusted Contacts Screen
  if (currentStep === 'contacts') {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[colors.background, colors.surface]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Your Safety Squad</Text>
              <Text style={styles.subtitle}>
                Who's someone you trust when things get tough?
              </Text>
            </View>

            <View style={styles.contactsInfo}>
              <Text style={styles.contactsDescription}>
                They'll only be contacted if you're really struggling and choose to reach out. 
                You're always in control.
              </Text>
              
              <View style={styles.addContactButton}>
                <Text style={styles.addContactText}>
                  📱 You can add trusted contacts from the Support tab after setup!
                </Text>
              </View>
            </View>

            <View style={styles.footer}>
              <Button
                title="Enter the App"
                onPress={handleSkipContacts}
                size="large"
                style={styles.button}
              />
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodySecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  featuresList: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  feature: {
    ...typography.body,
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  footer: {
    marginTop: spacing.xl,
  },
  disclaimer: {
    ...typography.caption,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  button: {
    marginHorizontal: spacing.md,
  },
  resultFooter: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  contactsInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  contactsDescription: {
    ...typography.bodySecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  addContactButton: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
  },
  addContactText: {
    ...typography.body,
    textAlign: 'center',
  },
});

const simpleStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  questionNumber: {
    ...typography.caption,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  questionContainer: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  questionText: {
    ...typography.h2,
    textAlign: 'center',
    lineHeight: 32,
  },
  optionsContainer: {
    flex: 1,
  },
  optionButton: {
    marginBottom: spacing.md,
  },
  congratsText: {
    ...typography.h3,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  typeContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: 16,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  personalityType: {
    ...typography.h1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  descriptionContainer: {
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
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
    color: colors.primary,
  },
  listText: {
    ...typography.body,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
});

export default OnboardingScreen;