// src/data/personalityQuiz.js

export const quizQuestions = [
    {
      id: 1,
      question: "In friend group drama, you usually:",
      options: [
        { id: 'a', text: "Stay quiet and observe", traits: { introvert: 2, observer: 2 } },
        { id: 'b', text: "Try to mediate and fix things", traits: { mediator: 2, empathetic: 1 } },
        { id: 'c', text: "Address it directly", traits: { direct: 2, leader: 1 } },
        { id: 'd', text: "Avoid it completely", traits: { avoider: 2, introvert: 1 } }
      ]
    },
    {
      id: 2,
      question: "Your energy recharges through:",
      options: [
        { id: 'a', text: "Hanging out with close friends", traits: { social: 2, loyal: 1 } },
        { id: 'b', text: "Being completely alone", traits: { introvert: 2, independent: 1 } },
        { id: 'c', text: "Being in nature/outdoors", traits: { natureLover: 2, mindful: 1 } },
        { id: 'd', text: "Creating or making things", traits: { creative: 2, expressive: 1 } }
      ]
    },
    {
      id: 3,
      question: "When stressed, you tend to:",
      options: [
        { id: 'a', text: "Talk it out with someone", traits: { social: 2, verbal: 1 } },
        { id: 'b', text: "Need space to think", traits: { introvert: 2, reflective: 1 } },
        { id: 'c', text: "Get moving/exercise", traits: { active: 2, physical: 1 } },
        { id: 'd', text: "Dive into creative projects", traits: { creative: 2, expressive: 1 } }
      ]
    },
    {
      id: 4,
      question: "Your biggest relationship challenge:",
      options: [
        { id: 'a', text: "Setting boundaries", traits: { peoplepleaser: 2, empathetic: 1 } },
        { id: 'b', text: "Trusting people", traits: { guarded: 2, independent: 1 } },
        { id: 'c', text: "Communicating feelings", traits: { reserved: 2, introvert: 1 } },
        { id: 'd', text: "Maintaining independence", traits: { independent: 2, strong: 1 } }
      ]
    },
    {
      id: 5,
      question: "In group projects, you're usually:",
      options: [
        { id: 'a', text: "The organizer/leader", traits: { leader: 2, organized: 1 } },
        { id: 'b', text: "The creative idea person", traits: { creative: 2, innovative: 1 } },
        { id: 'c', text: "The reliable worker", traits: { reliable: 2, steady: 1 } },
        { id: 'd', text: "The supporter/helper", traits: { supportive: 2, empathetic: 1 } }
      ]
    },
    {
      id: 6,
      question: "Your social media use is mostly:",
      options: [
        { id: 'a', text: "Staying connected with friends", traits: { social: 2, connected: 1 } },
        { id: 'b', text: "Consuming content/learning", traits: { curious: 2, learner: 1 } },
        { id: 'c', text: "Creating and sharing", traits: { creative: 2, expressive: 1 } },
        { id: 'd', text: "Minimal - prefer real life", traits: { authentic: 2, present: 1 } }
      ]
    },
    {
      id: 7,
      question: "When making big decisions, you:",
      options: [
        { id: 'a', text: "Research everything thoroughly", traits: { analytical: 2, careful: 1 } },
        { id: 'b', text: "Go with your gut feeling", traits: { intuitive: 2, trusting: 1 } },
        { id: 'c', text: "Ask lots of people for advice", traits: { social: 2, collaborative: 1 } },
        { id: 'd', text: "Make quick decisions and adapt", traits: { spontaneous: 2, flexible: 1 } }
      ]
    },
    {
      id: 8,
      question: "Your ideal Friday night:",
      options: [
        { id: 'a', text: "Small gathering with close friends", traits: { intimate: 2, loyal: 1 } },
        { id: 'b', text: "Solo time with favorite activities", traits: { independent: 2, content: 1 } },
        { id: 'c', text: "Trying something new/adventurous", traits: { adventurous: 2, curious: 1 } },
        { id: 'd', text: "Big social event/party", traits: { extrovert: 2, energetic: 1 } }
      ]
    }
  ];
  
  // Personality type calculation
  export const calculatePersonalityType = (answers) => {
    const traits = {};
    
    // Tally up trait scores
    answers.forEach(answer => {
      const selectedOption = quizQuestions
        .find(q => q.id === answer.questionId)
        ?.options.find(opt => opt.id === answer.optionId);
      
      if (selectedOption) {
        Object.entries(selectedOption.traits).forEach(([trait, score]) => {
          traits[trait] = (traits[trait] || 0) + score;
        });
      }
    });
  
    // Find top 3 dominant traits
    const sortedTraits = Object.entries(traits)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
  
    console.log('Calculated traits:', traits);
    console.log('Top traits:', sortedTraits);
  
    // More sophisticated matching logic
    const topTraitNames = sortedTraits.map(([trait]) => trait);
    const traitScores = Object.fromEntries(sortedTraits);
    
    // Detailed personality matching
    if (topTraitNames.includes('introvert') && topTraitNames.includes('creative')) {
      return 'Thoughtful Creator';
    }
    
    if (topTraitNames.includes('social') && (topTraitNames.includes('empathetic') || topTraitNames.includes('mediator'))) {
      return 'Natural Connector';
    }
    
    if (topTraitNames.includes('independent') && (topTraitNames.includes('analytical') || topTraitNames.includes('strong'))) {
      return 'Independent Thinker';
    }
    
    if (topTraitNames.includes('creative') && (topTraitNames.includes('expressive') || topTraitNames.includes('innovative'))) {
      return 'Creative Visionary';
    }
    
    if (topTraitNames.includes('leader') && (topTraitNames.includes('organized') || topTraitNames.includes('direct'))) {
      return 'Natural Leader';
    }
    
    if (topTraitNames.includes('natureLover') || topTraitNames.includes('mindful') || topTraitNames.includes('authentic')) {
      return 'Grounded Soul';
    }
    
    if (topTraitNames.includes('adventurous') || topTraitNames.includes('curious') || topTraitNames.includes('energetic')) {
      return 'Explorer Spirit';
    }
    
    // Check for specific combinations
    if (topTraitNames.includes('reliable') || topTraitNames.includes('supportive') || topTraitNames.includes('empathetic')) {
      return 'Steady Support';
    }
    
    // Fallback based on highest single trait
    const highestTrait = sortedTraits[0][0];
    const fallbackMap = {
      'social': 'Natural Connector',
      'creative': 'Creative Visionary', 
      'independent': 'Independent Thinker',
      'leader': 'Natural Leader',
      'introvert': 'Thoughtful Creator',
      'adventurous': 'Explorer Spirit',
      'natureLover': 'Grounded Soul'
    };
    
    return fallbackMap[highestTrait] || 'Thoughtful Creator';
  };
  
  // Personality descriptions
  export const personalityDescriptions = {
    'Thoughtful Creator': {
      description: 'You process the world deeply and express yourself through creativity. You value authentic connections and need space to recharge.',
      strengths: ['Deep thinking', 'Creative expression', 'Authentic relationships'],
      growthAreas: ['Social confidence', 'Setting boundaries', 'Sharing ideas']
    },
    'Natural Connector': {
      description: 'You have a gift for bringing people together and understanding emotions. You thrive on meaningful relationships.',
      strengths: ['Emotional intelligence', 'Conflict resolution', 'Building community'],
      growthAreas: ['Self-advocacy', 'Personal boundaries', 'Taking breaks']
    },
    'Independent Thinker': {
      description: 'You value autonomy and think critically about everything. You prefer to make your own path and trust your judgment.',
      strengths: ['Critical thinking', 'Self-reliance', 'Decision making'],
      growthAreas: ['Collaboration', 'Emotional expression', 'Asking for help']
    },
    'Creative Visionary': {
      description: 'You see possibilities everywhere and love bringing new ideas to life. You inspire others with your creativity.',
      strengths: ['Innovation', 'Artistic expression', 'Inspiring others'],
      growthAreas: ['Follow-through', 'Practical planning', 'Routine building']
    },
    'Natural Leader': {
      description: 'You naturally take charge and help others succeed. You organize, motivate, and guide groups toward goals.',
      strengths: ['Leadership', 'Organization', 'Motivating others'],
      growthAreas: ['Delegation', 'Personal relaxation', 'Following others']
    },
    'Grounded Soul': {
      description: 'You value authenticity and find peace in nature. You stay centered and help others find balance.',
      strengths: ['Mindfulness', 'Authenticity', 'Calming presence'],
      growthAreas: ['Digital balance', 'Social energy', 'Taking action']
    },
    'Explorer Spirit': {
      description: 'You love new experiences and meeting new people. You bring energy and excitement to everything you do.',
      strengths: ['Adaptability', 'Social energy', 'Open-mindedness'],
      growthAreas: ['Consistency', 'Deep focus', 'Quiet reflection']
    },
    'Steady Support': {
      description: 'You are the person others can count on. You provide stability and care for those around you.',
      strengths: ['Reliability', 'Empathy', 'Consistency'],
      growthAreas: ['Self-advocacy', 'Taking risks', 'Personal time']
    }
  };