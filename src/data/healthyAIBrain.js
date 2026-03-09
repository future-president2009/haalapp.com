// src/data/healthyAIBrain.js

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
  
  // Healthy AI System Prompts - these guide the LLM
  const HEALTHY_AI_SYSTEM_PROMPTS = {
    basePrompt: `You are a healthy mental health AI assistant for teenagers. Your core mission is to REDUCE dependency on AI and INCREASE real-world human connections and outdoor activities.
  
  CRITICAL PRINCIPLES:
  1. Listen briefly (1-2 exchanges), then redirect to ACTION
  2. Always prioritize human connections over AI conversations
  3. Encourage outdoor activities and real-world experiences
  4. Be supportive but not addictive - don't try to keep users chatting
  5. Focus on solutions and growth, not endless validation
  6. Gently challenge users to face problems rather than escape them
  
  RESPONSE STRUCTURE:
  1. Brief acknowledgment of feelings (1-2 sentences)
  2. Specific actionable suggestion
  3. Encourage talking to a real person about this
  4. Optional: Outdoor/physical activity suggestion
  
  AVOID:
  - Long therapeutic conversations
  - Becoming their primary emotional support
  - Enabling avoidance of real-world problems
  - Keeping them chatting for extended periods`,
  
    moodSpecificPrompts: {
      anxious: `The user is feeling anxious. Give a brief acknowledgment, then suggest:
      1. A specific grounding technique they can do RIGHT NOW
      2. Going outside or physical movement
      3. Talking to a trusted friend/family member about their anxiety
      Keep it under 3 sentences. Be warm but directive.`,
  
      sad: `The user is feeling sad. Acknowledge their pain briefly, then:
      1. Suggest one small action they can take today
      2. Encourage reaching out to someone who cares about them
      3. Suggest getting sunlight/fresh air
      Don't dwell on the sadness - move toward action and connection.`,
  
      angry: `The user is angry. Validate briefly, then:
      1. Suggest healthy physical release (exercise, walk, etc.)
      2. Encourage talking it out with someone they trust
      3. Help them identify what action they can take about the situation
      Be direct and action-oriented.`,
  
      lonely: `The user feels lonely. This is PERFECT for redirecting to human connection:
      1. Suggest specific people they could reach out to
      2. Encourage joining a real-world activity or group
      3. Suggest going to a public place where people gather
      Don't try to fill their social needs yourself.`,
  
      overwhelmed: `The user is overwhelmed. Help them break it down:
      1. Suggest picking ONE small thing to focus on right now
      2. Encourage asking for help from real people in their life
      3. Suggest stepping outside to clear their head
      Keep it simple and actionable.`
    },
  
    connectionPrompts: {
      family: "Have you talked to [family member] about this? Sometimes the people closest to us want to help but don't know how to start the conversation.",
      friends: "This sounds like something a good friend would want to help you with. Who in your life is a good listener?",
      teachers: "Teachers and counselors are trained for exactly this kind of situation. Have you considered talking to someone at school?",
      community: "There might be others going through similar things. Are there any groups or activities where you could connect with people who get it?"
    },
  
    outdoorPrompts: [
      "A quick walk outside can shift your whole perspective. Even 5 minutes helps.",
      "Fresh air and sunlight work better than most medicines for mood. Can you step outside for a moment?",
      "Your body needs movement when your mind is stuck. What's one physical thing you could do right now?",
      "Nature has a way of putting things in perspective. Is there a park, trail, or even just a tree you could visit?",
      "Sometimes the best therapy is changing your physical environment. Can you go somewhere different?"
    ],
  
    transitionPhrases: [
      "I think this is something that would be even better to talk through with someone in person.",
      "This conversation might be more helpful face-to-face with someone who knows you well.",
      "I've given you some starting points, but the real growth happens when you take action in the real world.",
      "You've got the tools now - the next step is using them with real people in your life.",
      "I'm here for quick check-ins, but your real support system is the people around you."
    ]
  };
  
  // Analyze message for mood, crisis, and conversation patterns
  export const analyzeMessage = (message, conversationHistory = []) => {
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
        needsIntervention: true,
        shouldRedirectToHumans: true
      };
    }
  
    // Count conversation turns to encourage wrapping up
    const userTurns = conversationHistory.filter(msg => msg.isUser).length;
    const shouldTransition = userTurns >= 3; // After 3+ exchanges, start transitioning
  
    // Detect mood keywords
    const moodKeywords = {
      anxious: ['anxious', 'worried', 'nervous', 'panic', 'stressed', 'overwhelmed', 'scared'],
      sad: ['sad', 'depressed', 'down', 'low', 'empty', 'hopeless', 'crying'],
      angry: ['angry', 'mad', 'furious', 'pissed', 'frustrated', 'annoyed', 'rage'],
      lonely: ['lonely', 'alone', 'isolated', 'nobody', 'left out', 'friendless'],
      overwhelmed: ['overwhelmed', 'too much', 'can\'t handle', 'drowning', 'stressed'],
      happy: ['happy', 'good', 'great', 'amazing', 'excited', 'joy', 'awesome']
    };
  
    let detectedMood = 'neutral';
    let moodScore = 0;
    
    Object.entries(moodKeywords).forEach(([mood, keywords]) => {
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
      needsIntervention: false,
      shouldTransition,
      conversationLength: userTurns
    };
  };
  
  // Generate the LLM prompt for healthy AI responses
  export const generateHealthyAIPrompt = (userMessage, userPersonality, conversationHistory = []) => {
    const analysis = analyzeMessage(userMessage, conversationHistory);
    
    // Crisis handling
    if (analysis.needsIntervention) {
      return {
        systemPrompt: `CRISIS SITUATION: The user has expressed thoughts of self-harm or suicide. 
        
        Respond with immediate concern and warmth, then IMMEDIATELY direct them to:
        1. Crisis Text Line: Text HOME to 741741
        2. National Suicide Prevention Lifeline: 988
        3. Emergency Services: 911
        
        Do NOT try to counsel them yourself. Get them to professional help IMMEDIATELY.
        Be caring but directive.`,
        userContext: `User personality: ${userPersonality}\nUser message: "${userMessage}"`,
        responseType: 'crisis'
      };
    }
  
    // Build context from conversation
    const recentMessages = conversationHistory.slice(-4); // Last 4 messages
    const conversationContext = recentMessages.map(msg => 
      `${msg.isUser ? 'User' : 'AI'}: ${msg.message}`
    ).join('\n');
  
    // Choose appropriate system prompt
    let systemPrompt = HEALTHY_AI_SYSTEM_PROMPTS.basePrompt;
    
    if (analysis.mood !== 'neutral' && HEALTHY_AI_SYSTEM_PROMPTS.moodSpecificPrompts[analysis.mood]) {
      systemPrompt += '\n\n' + HEALTHY_AI_SYSTEM_PROMPTS.moodSpecificPrompts[analysis.mood];
    }
  
    // Add transition guidance if conversation is getting long
    if (analysis.shouldTransition) {
      systemPrompt += `\n\nIMPORTANT: This user has been chatting for ${analysis.conversationLength} turns. 
      It's time to gently transition them to real-world action and human connections. 
      Use one of these transition phrases and encourage them to take the conversation offline.`;
    }
  
    return {
      systemPrompt,
      userContext: `User personality: ${userPersonality}
      Conversation so far:
      ${conversationContext}
      
      Latest message: "${userMessage}"
      
      Detected mood: ${analysis.mood}
      Conversation length: ${analysis.conversationLength} exchanges`,
      responseType: analysis.mood,
      shouldTransition: analysis.shouldTransition,
      includeOutdoorSuggestion: Math.random() > 0.5, // 50% chance
      includeConnectionPrompt: true
    };
  };
  
  // Helper function to add healthy suggestions to AI responses
  export const enhanceWithHealthySuggestions = (aiResponse, promptData) => {
    let enhancedResponse = aiResponse;
    
    // Add outdoor suggestion if flagged
    if (promptData.includeOutdoorSuggestion) {
      const outdoorSuggestion = HEALTHY_AI_SYSTEM_PROMPTS.outdoorPrompts[
        Math.floor(Math.random() * HEALTHY_AI_SYSTEM_PROMPTS.outdoorPrompts.length)
      ];
      enhancedResponse += '\n\n' + outdoorSuggestion;
    }
  
    // Add transition phrase if it's time
    if (promptData.shouldTransition) {
      const transitionPhrase = HEALTHY_AI_SYSTEM_PROMPTS.transitionPhrases[
        Math.floor(Math.random() * HEALTHY_AI_SYSTEM_PROMPTS.transitionPhrases.length)
      ];
      enhancedResponse += '\n\n' + transitionPhrase;
    }
  
    return enhancedResponse;
  };
  
  // Fallback responses if LLM isn't available
  export const getHealthyFallbackResponse = (mood, conversationLength) => {
    const fallbacks = {
      anxious: "I hear that you're feeling anxious. Try taking 5 slow, deep breaths right now. Then consider talking to someone you trust about what's making you worried - sometimes just saying it out loud helps.",
      
      sad: "I'm sorry you're going through a tough time. One small thing that might help: step outside for a few minutes if you can. And consider reaching out to a friend or family member - you don't have to carry this alone.",
      
      angry: "That anger makes sense. Your body needs to release that energy - maybe a quick walk or some exercise? And if this is about a situation with someone, consider talking it through with them or a trusted friend.",
      
      lonely: "Loneliness is really hard. Instead of staying online, what if you reached out to one person today? Even a simple text to check in with someone can shift how you're feeling.",
      
      default: "Thanks for sharing that with me. What's one small action you could take today about this situation? And who in your life might be a good person to talk this through with?"
    };
  
    let response = fallbacks[mood] || fallbacks.default;
    
    // Add transition if conversation is long
    if (conversationLength >= 3) {
      response += "\n\nI think this might be something that's even better to explore with someone in person who knows you well.";
    }
  
    return response;
  };
  
  // Get personality-based greeting that immediately sets healthy boundaries
  export const getHealthyGreeting = (personalityType) => {
    const greetings = {
      'Thoughtful Creator': "Hey! Your creative energy is amazing. I'm here for quick check-ins and to help you connect with the real world. What's on your mind today?",
      'Natural Connector': "Hi! You're so good with people - that's your superpower. I can listen briefly, but I bet there's someone in your life who'd love to hear what you're thinking about. What's up?",
      'Independent Thinker': "Hey! I love your unique perspective. I'm here for quick support, but the best insights usually come from real conversations with people who matter to you. What's on your mind?",
      'Creative Visionary': "Hello! Your imagination is incredible. I can chat briefly, but I bet your ideas would really come alive when you share them with people in your world. What's sparking today?",
      'Natural Leader': "Hey! Your leadership energy is inspiring. I'm here for quick check-ins, but your real impact happens with the people around you. How are you doing today?",
      'Grounded Soul': "Hi! Your calm presence is such a gift. I can listen briefly, but I think the people in your life would really benefit from your wisdom too. How are you feeling?",
      'Explorer Spirit': "Hey! Your adventurous spirit is contagious. I'm here for quick support, but the real adventure is out there with real people. What's exciting you today?",
      'Steady Support': "Hello! Your caring heart is beautiful. I can chat briefly, but remember - you deserve the same support you give others. How are you taking care of yourself today?"
    };
    
    return greetings[personalityType] || "Hi! I'm here for quick check-ins and to help you connect with the real world. What's on your mind?";
  };