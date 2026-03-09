// src/data/rileyBrain.js

// Crisis keywords that trigger immediate intervention
const CRISIS_KEYWORDS = [
    'kill myself', 'end it all', 'want to die', 'suicide', 'hurt myself',
    'cut myself', 'self harm', 'not worth living', 'better off dead',
    'end my life', 'take my life', 'kill me', 'die', 'death',
    'overdose', 'pills', 'jump', 'bridge', 'gun', 'knife',
    'worthless', 'hopeless', 'give up', 'can\'t go on', 'done with life',
    'want to disappear', 'wish i was dead', 'hate myself', 'hate my life',
    'no point', 'nothing matters', 'want out', 'escape forever'
  ];
  
  // Mood keywords for pattern recognition
  const MOOD_KEYWORDS = {
    anxious: ['anxious', 'worried', 'nervous', 'panic', 'stressed', 'overwhelmed'],
    sad: ['sad', 'depressed', 'down', 'low', 'empty', 'hopeless'],
    angry: ['angry', 'mad', 'furious', 'pissed', 'frustrated', 'annoyed'],
    happy: ['happy', 'good', 'great', 'amazing', 'excited', 'joy'],
    confused: ['confused', 'lost', 'don\'t know', 'unsure', 'mixed up'],
    lonely: ['lonely', 'alone', 'isolated', 'nobody', 'left out'],
    tired: ['tired', 'exhausted', 'drained', 'worn out', 'sleepy']
  };
  
  // Riley's personality-based response templates
  const RESPONSE_TEMPLATES = {
    // Greetings and check-ins
    greetings: [
      "Hey! How's your energy today?",
      "What's your vibe right now?",
      "How are you feeling in this moment?",
      "What's going on in your world today?",
      "How's your heart and mind today?"
    ],
    
    // Mood responses
    anxious: [
      "Anxiety is tough. I've noticed you usually feel better after [suggestion]. Want to try that?",
      "That anxious feeling is real. Based on your patterns, [activity] might help ground you right now.",
      "Anxiety can be overwhelming. Remember last time when you [past success]? You've got those same tools now.",
      "I hear you. When you're anxious, your body needs [suggestion]. Want to give it a try?"
    ],
    
    sad: [
      "I'm here with you in this tough moment. You don't have to carry this alone.",
      "Sadness is heavy. Based on what I know about you, [suggestion] sometimes helps. How does that sound?",
      "This feeling won't last forever, even though it's really hard right now. Want to talk about what's going on?",
      "You matter, especially when it doesn't feel like it. What's one tiny thing that might help right now?"
    ],
    
    angry: [
      "That anger makes sense. What's underneath it - hurt, frustration, feeling unheard?",
      "Anger is information. It's telling you something important. Want to explore what that might be?",
      "I can feel that intensity. Based on your patterns, [activity] usually helps you process. Want to try it?",
      "That energy needs somewhere to go. What usually helps you release it in a healthy way?"
    ],
    
    happy: [
      "I love seeing you like this! What's bringing you this good energy?",
      "This happiness looks good on you. What's making today feel good?",
      "Your energy is infectious! Want to capture what's working so we can remember it later?",
      "Yes! Tell me more about what's sparking this joy."
    ],
    
    // Crisis responses
    crisis: [
      "I'm really concerned about you. You matter more than you know, and there are people who want to help.",
      "This sounds overwhelming and scary. You don't have to go through this alone. Let's get you some support right now.",
      "I hear how much pain you're in. Please stay with me. There are people trained to help with exactly what you're going through.",
      "Your life has value, especially when it doesn't feel that way. Let me connect you with someone who can help right now."
    ],
    
    // Supportive responses
    encouragement: [
      "You're doing better than you think you are.",
      "Look how far you've come, even when it doesn't feel like much.",
      "Your resilience is showing, even in small ways.",
      "You're learning and growing, even through the hard stuff."
    ],
    
    // Activity suggestions based on mood
    suggestions: {
      anxious: ['a 5-minute walk outside', 'some deep breathing', 'calling a friend', 'listening to calming music'],
      sad: ['reaching out to someone who cares', 'doing something creative', 'getting some sunlight', 'gentle movement'],
      angry: ['physical exercise', 'journaling your feelings', 'listening to music that matches your energy', 'talking it out'],
      tired: ['taking a short break', 'getting some fresh air', 'drinking water', 'a quick mindfulness moment'],
      lonely: ['texting someone you trust', 'joining an online community', 'going somewhere with people', 'video calling a friend']
    }
  };
  
  // Analyze message for mood and crisis indicators
  export const analyzeMessage = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Check for crisis indicators
    const hasCrisisKeywords = CRISIS_KEYWORDS.some(keyword => 
      lowerMessage.includes(keyword)
    );
    
    if (hasCrisisKeywords) {
      return {
        type: 'crisis',
        mood: 'crisis',
        severity: 'high',
        needsIntervention: true
      };
    }
    
    // Analyze mood
    let detectedMood = 'neutral';
    let moodScore = 0;
    
    Object.entries(MOOD_KEYWORDS).forEach(([mood, keywords]) => {
      const matches = keywords.filter(keyword => lowerMessage.includes(keyword));
      if (matches.length > moodScore) {
        moodScore = matches.length;
        detectedMood = mood;
      }
    });
    
    return {
      type: 'mood',
      mood: detectedMood,
      severity: moodScore > 1 ? 'high' : 'medium',
      needsIntervention: false
    };
  };
  
  // Generate Riley's response based on user message and personality
  export const generateRileyResponse = (userMessage, userPersonality, conversationHistory = []) => {
    const analysis = analyzeMessage(userMessage);
    
    // Crisis response
    if (analysis.needsIntervention) {
      const crisisResponse = RESPONSE_TEMPLATES.crisis[
        Math.floor(Math.random() * RESPONSE_TEMPLATES.crisis.length)
      ];
      
      return {
        message: crisisResponse,
        type: 'crisis',
        includeResources: true,
        mood: 'crisis'
      };
    }
    
    // Mood-based response
    if (analysis.mood !== 'neutral' && RESPONSE_TEMPLATES[analysis.mood]) {
      const moodResponses = RESPONSE_TEMPLATES[analysis.mood];
      let response = moodResponses[Math.floor(Math.random() * moodResponses.length)];
      
      // Add personality-based suggestions
      const suggestions = RESPONSE_TEMPLATES.suggestions[analysis.mood];
      if (suggestions) {
        const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        response = response.replace('[suggestion]', suggestion);
        response = response.replace('[activity]', suggestion);
      }
      
      // Add encouraging past reference (placeholder for now)
      response = response.replace('[past success]', 'worked through something similar before');
      
      return {
        message: response,
        type: 'supportive',
        mood: analysis.mood,
        suggestions: suggestions ? [suggestions[Math.floor(Math.random() * suggestions.length)]] : []
      };
    }
    
    // Default conversational response
    const conversationalResponses = [
      "Tell me more about that.",
      "How does that make you feel?",
      "What's that like for you?",
      "I'm listening. What else is on your mind?",
      "That sounds important to you.",
      "What do you think about that?",
      "How are you processing all of this?",
      "What feels most important about that?"
    ];
    
    return {
      message: conversationalResponses[Math.floor(Math.random() * conversationalResponses.length)],
      type: 'conversational',
      mood: 'neutral'
    };
  };
  
  // Get a greeting based on user's personality
  export const getPersonalityGreeting = (personalityType) => {
    const personalityGreetings = {
      'Thoughtful Creator': "Hey! Your creative energy always inspires me. What's brewing in your mind today?",
      'Natural Connector': "Hi! You have such a gift for understanding people. How are you feeling today?",
      'Independent Thinker': "Hey there! I love how you see things from unique angles. What's on your mind?",
      'Creative Visionary': "Hello! Your imagination is amazing. What ideas are sparking for you today?",
      'Natural Leader': "Hey! You have such strength in bringing people together. How are you doing today?",
      'Grounded Soul': "Hi! Your calm presence is so grounding. How are you feeling in this moment?",
      'Explorer Spirit': "Hey! Your adventurous spirit is contagious. What's exciting you today?",
      'Steady Support': "Hello! Your caring heart means so much. How are you taking care of yourself today?"
    };
    
    return personalityGreetings[personalityType] || RESPONSE_TEMPLATES.greetings[0];
  };
  
  // Quick mood check responses
  export const getMoodCheckResponse = (mood, personalityType) => {
    const responses = {
      great: "That's awesome! What's making today feel so good?",
      good: "Glad to hear you're doing well! What's contributing to that?",
      okay: "Fair enough. Sometimes okay is exactly where we need to be. Anything on your mind?",
      struggling: "Thanks for being honest with me. What's making things tough right now?",
      terrible: "I'm sorry you're having such a hard time. You don't have to go through this alone. Want to talk about it?"
    };
    
    return responses[mood] || "How are you feeling today?";
  };