// src/screens/ChatScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ChatBubble from '../components/chat/ChatBubble';
import TypingIndicator from '../components/chat/TypingIndicator';
import useUserStore from '../store/userStore';
import { simplifiedLLMService } from '../services/simplifiedLLMService';
import { getSimpleGreeting } from '../data/simplifiedHealthyAI';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

const ChatScreen = () => {
  console.log('DEBUGGING - API Key:', process.env.EXPO_PUBLIC_LLM_API_KEY?.substring(0, 10) + '...');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [isLLMConnected, setIsLLMConnected] = useState(true);
  const flatListRef = useRef(null);
  
  const { user, addChatMessage } = useUserStore();

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    // Send initial greeting
    if (messages.length === 0) {
      setTimeout(() => {
        sendAIMessage(getSimpleGreeting(user.personalityType), 'greeting');
      }, 1000);
    }
  };

  const sendAIMessage = (messageText, type = 'normal') => {
    const newMessage = {
      id: Date.now(),
      message: messageText,
      isUser: false,
      timestamp: new Date(),
      type: type
    };
    
    setMessages(prev => [...prev, newMessage]);
    addChatMessage(newMessage);
    setIsAITyping(false);
  };

  const isCrisisMessage = (message) => {
    const crisisKeywords = [
      'kill myself', 'want to die', 'suicide', 'end it all', 'hurt myself',
      'cut myself', 'self harm', 'not worth living', 'end my life'
    ];
    const lowerMessage = message.toLowerCase();
    return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  const handleSendMessage = async () => {
    console.log('Environment check:', process.env.EXPO_PUBLIC_LLM_API_KEY ? 'API key found' : 'NO API KEY');
    
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      message: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    addChatMessage(userMessage);
    
    const messageToAnalyze = inputText.trim();
    setInputText('');

    // Simple crisis check
    if (isCrisisMessage(messageToAnalyze)) {
      handleCrisisDetection();
      return;
    }

    // Show typing indicator
    setIsAITyping(true);

    try {
      // Generate response
      const response = await simplifiedLLMService.generateResponse(
        messageToAnalyze,
        messages
      );

      // Add realistic delay
      const delay = 1500 + Math.random() * 2000;
      setTimeout(() => {
        sendAIMessage(response.message, response.type);
        
        // Show transition suggestion if needed
        if (response.shouldTransition) {
          setTimeout(() => {
            showTransitionSuggestion();
          }, 2000);
        }
      }, delay);

    } catch (error) {
      console.error('AI Response Error:', error);
      setIsAITyping(false);
      
      // Fallback response
      setTimeout(() => {
        sendAIMessage(
          "I'm having trouble connecting right now. Is there someone you trust that you could talk to about this?",
          'fallback'
        );
      }, 1000);
    }
  };

  const handleCrisisDetection = () => {
    setIsAITyping(true);
    
    setTimeout(() => {
      sendAIMessage(
        "I'm really concerned about you. Please reach out for immediate help: Crisis Text Line: Text HOME to 741741, National Suicide Prevention Lifeline: 988. You matter, and I'm here to support you. What's been making things feel so difficult?",
        'crisis'
      );
      
      setTimeout(() => {
        showCrisisResources();
      }, 1000);
    }, 500);
  };

  const showCrisisResources = () => {
    Alert.alert(
      "Crisis Support",
      "If you're having thoughts of self-harm, please reach out for immediate help:\n\n• Crisis Text Line: Text HOME to 741741\n• National Suicide Prevention Lifeline: 988\n• Emergency Services: 911\n\nYou matter, and there are people who want to help.",
      [
        {
          text: "Call 988",
          onPress: () => {
            Alert.alert("Call 988", "This would open your phone's dialer with 988");
          }
        },
        {
          text: "Text Crisis Line",
          onPress: () => {
            Alert.alert("Text HOME to 741741", "This would open your messaging app");
          }
        },
        { text: "I'm Safe Now", style: "default" }
      ]
    );
  };

  const showTransitionSuggestion = () => {
    Alert.alert(
      "Take It Offline",
      "It sounds like you're working through something important. Sometimes the best conversations happen face-to-face with someone who knows you well.\n\nWho in your life might be a good person to continue this conversation with?",
      [
        { text: "I'll think about it", style: "default" },
        { 
          text: "Help me identify someone",
          onPress: () => {
            sendAIMessage(
              "Let's think about your support network. Who are the people in your life who care about you? Family members, friends, teachers, counselors, or mentors?",
              'supportive'
            );
          }
        }
      ]
    );
  };

  const renderMessage = ({ item }) => (
    <ChatBubble
      message={item.message}
      isUser={item.isUser}
      timestamp={item.timestamp}
      type={item.type}
    />
  );

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  // Count user messages to show conversation length indicator
  const userMessageCount = messages.filter(msg => msg.isUser).length;
  const showLengthWarning = userMessageCount >= 4;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.primary + '10', colors.background]}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.aiStatus}>
            <View style={[
              styles.statusDot,
              { backgroundColor: isLLMConnected ? colors.success : colors.warning }
            ]} />
            <Text style={styles.headerTitle}>
              Riley, AI Assistant
            </Text>
          </View>
          
          {showLengthWarning && (
            <View style={styles.lengthWarning}>
              <Text style={styles.warningText}>
                Consider taking this conversation to someone in person
              </Text>
            </View>
          )}
        </View>

        {/* Messages */}
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id.toString()}
            style={styles.messagesList}
            onContentSizeChange={scrollToBottom}
            onLayout={scrollToBottom}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <TypingIndicator visible={isAITyping} />
            }
          />

          {/* Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Share what's on your mind..."
                placeholderTextColor={colors.textMuted}
                multiline
                maxLength={500}
                onSubmitEditing={handleSendMessage}
                blurOnSubmit={false}
              />
              
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive
                ]}
                onPress={handleSendMessage}
                disabled={!inputText.trim() || isAITyping}
              >
                {isAITyping ? (
                  <ActivityIndicator size="small" color={colors.background} />
                ) : (
                  <LinearGradient
                    colors={
                      inputText.trim()
                        ? [colors.primary, colors.secondary]
                        : [colors.textMuted, colors.textMuted]
                    }
                    style={styles.sendGradient}
                  >
                    <Text style={[
                      styles.sendButtonText,
                      { color: inputText.trim() ? colors.background : colors.textSecondary }
                    ]}>
                      Send
                    </Text>
                  </LinearGradient>
                )}
              </TouchableOpacity>
            </View>
            
            {/* Healthy AI Footer */}
            <View style={styles.healthyFooter}>
              <Text style={styles.footerText}>
                This AI encourages real-world connections over digital dependency
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  
  aiStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  
  lengthWarning: {
    backgroundColor: colors.warning + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  
  warningText: {
    ...typography.body,
    color: colors.warning,
    fontSize: 13,
  },
  
  flex: {
    flex: 1,
  },
  
  messagesList: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  
  inputContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  textInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    maxHeight: 100,
    minHeight: 40,
    textAlignVertical: 'center',
  },
  
  sendButton: {
    marginLeft: spacing.sm,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  
  sendButtonActive: {
    // Styles handled by gradient
  },
  
  sendButtonInactive: {
    backgroundColor: colors.textMuted + '20',
  },
  
  sendGradient: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  
  sendButtonText: {
    ...typography.button,
    fontWeight: '600',
  },
  
  healthyFooter: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  
  footerText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
  },
});

export default ChatScreen;