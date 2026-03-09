// src/data/crisisResources.js

export const CRISIS_HOTLINES = [
    {
      id: 'suicide_prevention',
      name: '988 Suicide & Crisis Lifeline',
      phone: '988',
      description: 'Free and confidential support for people in distress, prevention and crisis resources.',
      availability: '24/7',
      languages: ['English', 'Spanish'],
      type: 'crisis'
    },
    {
      id: 'crisis_text_line',
      name: 'Crisis Text Line',
      phone: '741741',
      textCode: 'HOME',
      description: 'Free crisis support via text message. Text HOME to 741741.',
      availability: '24/7',
      languages: ['English', 'Spanish'],
      type: 'crisis'
    },
    {
      id: 'teen_line',
      name: 'Teen Line',
      phone: '800-852-8336',
      description: 'Teen-to-teen support. Teens helping teens.',
      availability: '6 PM - 10 PM PST',
      languages: ['English'],
      type: 'teen'
    },
    {
      id: 'trevor_project',
      name: 'The Trevor Project',
      phone: '1-866-488-7386',
      description: 'Crisis support for LGBTQ+ young people.',
      availability: '24/7',
      languages: ['English', 'Spanish'],
      type: 'lgbtq'
    }
  ];
  
  export const MENTAL_HEALTH_RESOURCES = [
    {
      id: 'psychology_today',
      name: 'Psychology Today',
      website: 'psychologytoday.com',
      description: 'Find therapists and mental health professionals in your area.',
      type: 'directory'
    },
    {
      id: 'nami',
      name: 'NAMI (National Alliance on Mental Illness)',
      website: 'nami.org',
      phone: '1-800-950-6264',
      description: 'Mental health support, education, and advocacy.',
      type: 'support'
    },
    {
      id: 'betterhelp',
      name: 'BetterHelp',
      website: 'betterhelp.com',
      description: 'Online therapy and counseling services.',
      type: 'therapy',
      ageRestriction: '18+'
    },
    {
      id: 'talkspace',
      name: 'Talkspace',
      website: 'talkspace.com',
      description: 'Online therapy platform with licensed therapists.',
      type: 'therapy',
      ageRestriction: '18+'
    }
  ];
  
  export const SELF_HELP_RESOURCES = [
    {
      id: 'headspace',
      name: 'Headspace',
      description: 'Meditation and mindfulness app.',
      type: 'app'
    },
    {
      id: 'calm',
      name: 'Calm',
      description: 'Sleep stories, meditation, and relaxation.',
      type: 'app'
    },
    {
      id: 'youfeel_like_shit',
      name: 'YouFeelLikeShit.com',
      description: 'Interactive self-care guide for when you\'re struggling.',
      type: 'website'
    },
    {
      id: 'seven_cups',
      name: '7 Cups',
      description: 'Free emotional support and online therapy.',
      type: 'support'
    }
  ];
  
  export const COPING_STRATEGIES = [
    {
      id: 'grounding_54321',
      title: '5-4-3-2-1 Grounding Technique',
      description: 'Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.',
      category: 'grounding',
      timeNeeded: '2-3 minutes'
    },
    {
      id: 'box_breathing',
      title: 'Box Breathing',
      description: 'Breathe in for 4, hold for 4, out for 4, hold for 4. Repeat.',
      category: 'breathing',
      timeNeeded: '3-5 minutes'
    },
    {
      id: 'ice_cube',
      title: 'Ice Cube Technique',
      description: 'Hold an ice cube in your hand to ground yourself in the present moment.',
      category: 'grounding',
      timeNeeded: '1-2 minutes'
    },
    {
      id: 'progressive_muscle',
      title: 'Progressive Muscle Relaxation',
      description: 'Tense and release each muscle group, starting from your toes.',
      category: 'relaxation',
      timeNeeded: '10-15 minutes'
    },
    {
      id: 'safe_person',
      title: 'Call Your Safe Person',
      description: 'Reach out to someone you trust. You don\'t have to go through this alone.',
      category: 'social',
      timeNeeded: '10+ minutes'
    },
    {
      id: 'family_support',
      title: 'Family Communication Strategies',
      description: 'Learn ways to improve communication and connection with family members.',
      category: 'social',
      timeNeeded: '5-10 minutes'
    }
  ];
  
  export const SAFETY_PLAN_TEMPLATE = {
    warningSignsTitle: "My Warning Signs",
    warningSignsPrompt: "What tells me I'm starting to struggle?",
    warningSignsExamples: [
      "Feeling hopeless",
      "Isolating from friends",
      "Not sleeping well",
      "Difficulty concentrating"
    ],
    
    copingStrategiesTitle: "My Coping Strategies",
    copingStrategiesPrompt: "What helps me feel better?",
    copingStrategiesExamples: [
      "Listen to music",
      "Take a walk",
      "Call a friend",
      "Write in journal"
    ],
    
    supportPeopleTitle: "People I Can Reach Out To",
    supportPeoplePrompt: "Who can I contact when I need help?",
    supportPeopleExamples: [
      "Best friend",
      "Family member",
      "School counselor",
      "Therapist"
    ],
    
    professionalContactsTitle: "Professional Contacts",
    professionalContactsPrompt: "Mental health professionals in my life:",
    professionalContactsExamples: [
      "Therapist",
      "Psychiatrist",
      "School counselor",
      "Family doctor"
    ],
    
    environmentTitle: "Making My Environment Safer",
    environmentPrompt: "What can I do to make my space safer?",
    environmentExamples: [
      "Remove harmful items",
      "Stay with supportive people",
      "Avoid triggering content",
      "Create calming space"
    ]
  };
  
  export const getCrisisResourcesByType = (type) => {
    switch (type) {
      case 'immediate':
        return CRISIS_HOTLINES.filter(resource => resource.type === 'crisis');
      case 'teen':
        return CRISIS_HOTLINES.filter(resource => resource.type === 'teen');
      case 'lgbtq':
        return CRISIS_HOTLINES.filter(resource => resource.type === 'lgbtq');
      case 'therapy':
        return MENTAL_HEALTH_RESOURCES.filter(resource => resource.type === 'therapy');
      case 'support':
        return MENTAL_HEALTH_RESOURCES.filter(resource => resource.type === 'support');
      default:
        return CRISIS_HOTLINES;
    }
  };
  
  export const getCopingStrategiesByCategory = (category) => {
    if (!category) return COPING_STRATEGIES;
    return COPING_STRATEGIES.filter(strategy => strategy.category === category);
  };