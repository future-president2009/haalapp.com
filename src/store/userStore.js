// src/store/userStore.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculatePersonalityType, personalityDescriptions } from '../data/personalityQuiz';

const useUserStore = create((set, get) => ({
  // User data
  user: {
    personalityType: null,
    personalityDescription: null,
    quizAnswers: [],
    trustedContacts: [],
    hasCompletedOnboarding: false,
    createdAt: null,
  },

  // Mood tracking data
  moodEntries: [],
  chatHistory: [],
  patterns: {
    weeklyInsights: [],
    triggers: [],
    strengths: [],
    suggestions: []
  },

  // Quiz state
  currentQuestionIndex: 0,
  quizAnswers: [],
  isQuizComplete: false,

  // Actions
  setQuizAnswer: (questionId, optionId) => {
    const { quizAnswers } = get();
    const updatedAnswers = [...quizAnswers];
    
    // Update or add answer
    const existingIndex = updatedAnswers.findIndex(a => a.questionId === questionId);
    if (existingIndex >= 0) {
      updatedAnswers[existingIndex] = { questionId, optionId };
    } else {
      updatedAnswers.push({ questionId, optionId });
    }

    set({ quizAnswers: updatedAnswers });
  },

  nextQuestion: () => {
    const { currentQuestionIndex } = get();
    set({ currentQuestionIndex: currentQuestionIndex + 1 });
  },

  completeQuiz: () => {
    const { quizAnswers } = get();
    const personalityType = calculatePersonalityType(quizAnswers);
    const personalityDescription = personalityDescriptions[personalityType];

    set({
      isQuizComplete: true,
      user: {
        ...get().user,
        personalityType,
        personalityDescription,
        quizAnswers,
        createdAt: new Date().toISOString(),
      }
    });
  },

  addTrustedContact: (contact) => {
    const { user } = get();
    const updatedContacts = [...user.trustedContacts, { 
      ...contact, 
      id: contact.id || Date.now().toString(),
      createdAt: new Date().toISOString()
    }];
    
    set({
      user: {
        ...user,
        trustedContacts: updatedContacts,
      }
    });
    
    get().saveUserData();
  },

  removeTrustedContact: (contactId) => {
    const { user } = get();
    const updatedContacts = user.trustedContacts.filter(contact => contact.id !== contactId);
    
    set({
      user: {
        ...user,
        trustedContacts: updatedContacts,
      }
    });
    
    get().saveUserData();
  },

  updateTrustedContact: (updatedContact) => {
    const { user } = get();
    const updatedContacts = user.trustedContacts.map(contact => 
      contact.id === updatedContact.id 
        ? { ...updatedContact, updatedAt: new Date().toISOString() }
        : contact
    );
    
    set({
      user: {
        ...user,
        trustedContacts: updatedContacts,
      }
    });
    
    get().saveUserData();
  },

  completeOnboarding: () => {
    set({
      user: {
        ...get().user,
        hasCompletedOnboarding: true,
      }
    });
    
    // Save to AsyncStorage
    get().saveUserData();
  },

  // Mood tracking actions
  addMoodEntry: (mood, activities = [], notes = '') => {
    const entry = {
      id: Date.now(),
      mood: mood, // 1-10 scale
      activities: activities,
      notes: notes,
      timestamp: new Date().toISOString(),
      dayOfWeek: new Date().getDay(),
      hour: new Date().getHours()
    };
    
    console.log('Adding mood entry:', entry);
    
    set(state => ({
      moodEntries: [...state.moodEntries, entry]
    }));
    
    // Save mood entries to AsyncStorage
    get().saveMoodData();
    
    // Generate new insights if we have enough data
    get().generateInsights();
  },

  addChatMessage: (message, isUser, mood = null, type = 'normal') => {
    const chatEntry = {
      id: Date.now(),
      message: message,
      isUser: isUser,
      mood: mood,
      type: type,
      timestamp: new Date().toISOString()
    };
    
    set(state => ({
      chatHistory: [...state.chatHistory, chatEntry]
    }));
  },

  generateInsights: () => {
    const { moodEntries, chatHistory } = get();
    
    if (moodEntries.length < 3) return; // Need at least 3 entries for patterns
    
    const insights = {
      weeklyInsights: [],
      triggers: [],
      strengths: [],
      suggestions: []
    };
    
    // Weekly mood average
    const recent7Days = moodEntries.slice(-7);
    const avgMood = recent7Days.reduce((sum, entry) => sum + entry.mood, 0) / recent7Days.length;
    
    if (avgMood > 7) {
      insights.weeklyInsights.push("You've been feeling pretty good this week! Your average mood is " + avgMood.toFixed(1) + "/10");
    } else if (avgMood < 4) {
      insights.weeklyInsights.push("This week has been challenging. Your average mood is " + avgMood.toFixed(1) + "/10. Remember, this feeling is temporary.");
    }
    
    // Day of week patterns
    const dayMoods = {};
    moodEntries.forEach(entry => {
      const day = entry.dayOfWeek;
      if (!dayMoods[day]) dayMoods[day] = [];
      dayMoods[day].push(entry.mood);
    });
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let bestDay = null;
    let worstDay = null;
    let bestAvg = 0;
    let worstAvg = 10;
    
    Object.entries(dayMoods).forEach(([day, moods]) => {
      if (moods.length >= 2) { // Need at least 2 data points
        const avg = moods.reduce((sum, mood) => sum + mood, 0) / moods.length;
        if (avg > bestAvg) {
          bestAvg = avg;
          bestDay = dayNames[day];
        }
        if (avg < worstAvg) {
          worstAvg = avg;
          worstDay = dayNames[day];
        }
      }
    });
    
    if (bestDay) {
      insights.strengths.push(`${bestDay}s seem to be your best days! You average ${bestAvg.toFixed(1)}/10`);
    }
    if (worstDay && worstDay !== bestDay) {
      insights.triggers.push(`${worstDay}s tend to be tougher. You average ${worstAvg.toFixed(1)}/10`);
    }
    
    // Activity patterns
    const activityMoods = {};
    moodEntries.forEach(entry => {
      entry.activities.forEach(activity => {
        if (!activityMoods[activity]) activityMoods[activity] = [];
        activityMoods[activity].push(entry.mood);
      });
    });
    
    Object.entries(activityMoods).forEach(([activity, moods]) => {
      if (moods.length >= 2) {
        const avg = moods.reduce((sum, mood) => sum + mood, 0) / moods.length;
        if (avg > 6.5) {
          insights.strengths.push(`${activity} consistently boosts your mood (${avg.toFixed(1)}/10 average)`);
        }
      }
    });
    
    // Generate suggestions based on patterns
    if (insights.strengths.length > 0) {
      insights.suggestions.push("Keep doing what's working for you - your patterns show real strengths!");
    }
    if (insights.triggers.length > 0) {
      insights.suggestions.push("On tough days, try incorporating activities that usually help you feel better.");
    }
    
    set(state => ({
      patterns: insights
    }));
  },

  // Persistence
  saveUserData: async () => {
    try {
      const { user } = get();
      await AsyncStorage.setItem('HAAL_USER_DATA', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  },

  saveMoodData: async () => {
    try {
      const { moodEntries, chatHistory, patterns } = get();
      const moodData = { moodEntries, chatHistory, patterns };
      await AsyncStorage.setItem('HAAL_MOOD_DATA', JSON.stringify(moodData));
      console.log('Mood data saved, total entries:', moodEntries.length);
    } catch (error) {
      console.error('Error saving mood data:', error);
    }
  },

  loadUserData: async () => {
    try {
      // Load user data
      const userData = await AsyncStorage.getItem('HAAL_USER_DATA');
      if (userData) {
        const parsedData = JSON.parse(userData);
        set({ user: parsedData });
      }

      // Load mood data
      const moodData = await AsyncStorage.getItem('HAAL_MOOD_DATA');
      if (moodData) {
        const parsedMoodData = JSON.parse(moodData);
        set({
          moodEntries: parsedMoodData.moodEntries || [],
          chatHistory: parsedMoodData.chatHistory || [],
          patterns: parsedMoodData.patterns || {
            weeklyInsights: [],
            triggers: [],
            strengths: [],
            suggestions: []
          }
        });
        console.log('Loaded mood entries:', parsedMoodData.moodEntries?.length || 0);
      }

      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  },

  resetQuiz: () => {
    set({
      currentQuestionIndex: 0,
      quizAnswers: [],
      isQuizComplete: false,
    });
  },

  // Data export functionality
  exportUserData: () => {
    const { user } = get();
    const exportData = {
      personalityType: user.personalityType,
      personalityDescription: user.personalityDescription,
      quizAnswers: user.quizAnswers,
      createdAt: user.createdAt,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(exportData, null, 2);
  },

  // Data deletion
  deleteAllUserData: async () => {
    try {
      await AsyncStorage.removeItem('HAAL_USER_DATA');
      set({
        user: {
          personalityType: null,
          personalityDescription: null,
          quizAnswers: [],
          trustedContacts: [],
          hasCompletedOnboarding: false,
          createdAt: null,
        },
        currentQuestionIndex: 0,
        quizAnswers: [],
        isQuizComplete: false,
      });
    } catch (error) {
      console.error('Error deleting user data:', error);
    }
  },

  // Helper getters
  getCurrentQuestion: () => {
    const { currentQuestionIndex } = get();
    return currentQuestionIndex;
  },

  getTotalQuestions: () => {
    return 8; // We have 8 questions in our quiz
  },

  getQuizProgress: () => {
    const { currentQuestionIndex } = get();
    return (currentQuestionIndex + 1) / get().getTotalQuestions();
  },
}));

export default useUserStore;