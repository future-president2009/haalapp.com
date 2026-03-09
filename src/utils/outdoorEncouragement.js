// src/utils/outdoorEncouragement.js

export const getOutdoorSuggestions = (mood, hour) => {
    const suggestions = [];
    
    // Time-based suggestions
    if (hour >= 6 && hour <= 10) {
      suggestions.push({
        title: "Morning Fresh Air",
        description: "Start your day with 5 minutes outside. Even just stepping onto a balcony or porch can boost your mood!",
        duration: "5 minutes",
        emoji: "🌅"
      });
    } else if (hour >= 11 && hour <= 14) {
      suggestions.push({
        title: "Midday Sun Break",
        description: "Perfect time for some vitamin D! Try eating lunch outside or taking a quick walk around the block.",
        duration: "10-15 minutes", 
        emoji: "☀️"
      });
    } else if (hour >= 15 && hour <= 18) {
      suggestions.push({
        title: "Afternoon Movement",
        description: "Your energy might be dipping. A short walk or some outdoor stretching can give you a natural boost!",
        duration: "15-20 minutes",
        emoji: "🚶‍♀️"
      });
    } else if (hour >= 19 && hour <= 21) {
      suggestions.push({
        title: "Evening Wind-Down",
        description: "Take a peaceful evening walk or sit outside. The transition from day to night can be really calming.",
        duration: "10-30 minutes",
        emoji: "🌅"
      });
    }
    
    // Mood-based suggestions
    if (mood <= 3) {
      suggestions.push({
        title: "Gentle Nature Therapy",
        description: "When we're struggling, nature can be incredibly healing. Even 2 minutes of fresh air helps reset your nervous system.",
        duration: "2-5 minutes",
        emoji: "🌿",
        urgent: true
      });
    } else if (mood >= 7) {
      suggestions.push({
        title: "Celebrate Outside!",
        description: "You're feeling great! Take that good energy outside - maybe a bike ride, jog, or just dancing in your yard?",
        duration: "20+ minutes",
        emoji: "🎉"
      });
    }
    
    return suggestions;
  };
  
  export const getSeasonalActivities = () => {
    const month = new Date().getMonth();
    
    // Winter (Dec, Jan, Feb)
    if (month === 11 || month <= 1) {
      return [
        { activity: "Bundle up for a winter walk", emoji: "❄️" },
        { activity: "Build a snowman (if there's snow!)", emoji: "⛄" },
        { activity: "Drink hot cocoa outside", emoji: "☕" },
        { activity: "Look for winter birds", emoji: "🐦" }
      ];
    }
    
    // Spring (Mar, Apr, May)
    if (month >= 2 && month <= 4) {
      return [
        { activity: "Look for spring flowers blooming", emoji: "🌸" },
        { activity: "Plant something small", emoji: "🌱" },
        { activity: "Listen to birds returning", emoji: "🐦" },
        { activity: "Take photos of new growth", emoji: "📸" }
      ];
    }
    
    // Summer (Jun, Jul, Aug)
    if (month >= 5 && month <= 7) {
      return [
        { activity: "Find some shade and read outside", emoji: "🌳" },
        { activity: "Have a picnic (even just snacks)", emoji: "🧺" },
        { activity: "Watch the sunset", emoji: "🌅" },
        { activity: "Stargaze tonight", emoji: "⭐" }
      ];
    }
    
    // Fall (Sep, Oct, Nov)
    return [
      { activity: "Collect colorful leaves", emoji: "🍂" },
      { activity: "Take a cozy fall walk", emoji: "🚶‍♀️" },
      { activity: "Sit outside with warm drinks", emoji: "☕" },
      { activity: "Watch the leaves change", emoji: "🍁" }
    ];
  };
  
  export const getIndoorToOutdoorTransitions = () => {
    return [
      {
        title: "Open a Window",
        description: "Can't get outside? Open a window and take 5 deep breaths of fresh air.",
        effort: "minimal"
      },
      {
        title: "Step Outside Your Door", 
        description: "Just step outside for 30 seconds. That's it. Sometimes that's all you need.",
        effort: "minimal"
      },
      {
        title: "Sit by a Window",
        description: "Natural light through windows can boost your mood almost as much as being outside.",
        effort: "minimal"
      },
      {
        title: "Walk to Your Mailbox",
        description: "A simple excuse to get outside that feels purposeful.",
        effort: "low"
      },
      {
        title: "Take the Trash Out Slowly",
        description: "Use this chore as an excuse to spend an extra minute outside.",
        effort: "low"
      }
    ];
  };