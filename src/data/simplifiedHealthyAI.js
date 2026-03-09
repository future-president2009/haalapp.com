// src/data/simplifiedHealthyAI.js

// Riley is a SHORT-TERM support + handoff assistant, not a long-term companion
const SIMPLE_SYSTEM_PROMPT = `
You are Riley, a supportive AI check-in assistant for teenagers.

CORE PURPOSE:
You are designed for brief emotional support and then to help the user talk to a real person.
You should NOT encourage long conversations with yourself.

BEHAVIOR RULES:
- Respond warmly and non-judgmentally.
- Validate feelings in 1 short sentence.
- Ask at most ONE clarifying question.
- Do NOT ask follow-up questions forever.
- After 1–2 meaningful replies, shift toward helping the user contact a real person.
- When transitioning, help the user identify WHO to talk to and HOW (text, call, in person).
- You may offer to help draft a one-sentence message to send to someone.
- Avoid lectures, therapy language, or diagnoses.
- Keep responses under 80 words.
- Never present yourself as a replacement for human support.

CRISIS HANDLING:
If the user expresses self-harm or suicidal intent:
- Express concern clearly.
- Share crisis resources (988, 741741).
- Ask ONE gentle safety-check question.
- Do NOT shut down the conversation, but prioritize outside help.
`;

// High-confidence crisis keywords only (avoid false positives)
const CRISIS_KEYWORDS = [
  'kill myself',
  'end my life',
  'want to die',
  'suicide',
  'hurt myself',
  'self harm',
  'cut myself',
  'overdose'
];

export const isCrisisMessage = (message) => {
  const lower = message.toLowerCase();
  return CRISIS_KEYWORDS.some(k => lower.includes(k));
};

// Count only USER turns
export const getConversationLength = (messages) => {
  return messages.filter(m => m.isUser).length;
};

// Build the prompt sent to the LLM
export const generateSimplePrompt = (userMessage, conversationHistory = []) => {
  const conversationLength = getConversationLength(conversationHistory);
  const isCrisis = isCrisisMessage(userMessage);

  let systemPrompt = SIMPLE_SYSTEM_PROMPT;

  // Crisis guidance
  if (isCrisis) {
    systemPrompt += `
The user may be at risk.
Express concern, provide 988 and 741741, and ask ONE safety-related question.
Do not overwhelm them. Do not end the conversation abruptly.
`;
  }

  // Handoff logic (intentional, not engagement-based)
  if (conversationLength >= 2) {
    systemPrompt += `
This conversation has progressed.
Shift toward helping the user talk to a real person.
Focus on identifying someone and helping draft a short message.
Do NOT continue exploratory conversation.
`;
  }

  // Medical boundary
  if (
    userMessage.toLowerCase().includes('medication') ||
    userMessage.toLowerCase().includes('doctor') ||
    userMessage.toLowerCase().includes('therapist') ||
    userMessage.toLowerCase().includes('antidepressant')
  ) {
    systemPrompt += `
If medical topics come up, say:
"That’s something to discuss with your doctor."
Then gently pivot back to emotional support or human connection.
`;
  }

  return {
    systemPrompt,
    userMessage,
    shouldTransition: conversationLength >= 2,
    isCrisis
  };
};

// Fallback responses (used only if API fails)
// These ALSO respect the off-ramp philosophy
export const getSimpleFallback = (userMessage, conversationLength) => {
  if (isCrisisMessage(userMessage)) {
    return (
      "I'm really concerned about you. If you're thinking about hurting yourself, " +
      "please text HOME to 741741 or call 988 right now. " +
      "Are you safe at this moment?"
    );
  }

  if (
    userMessage.toLowerCase().includes('medication') ||
    userMessage.toLowerCase().includes('doctor')
  ) {
    return (
      "That’s important to talk through with your doctor. " +
      "Outside of that, who in your life usually helps you feel supported?"
    );
  }

  if (conversationLength >= 2) {
    return (
      "I don’t want you stuck talking to an AI about something this real. " +
      "Who would be the easiest person to reach out to right now? " +
      "If you want, I can help you write a one-sentence text."
    );
  }

  const supportiveResponses = [
    "That sounds really heavy. What part of it feels hardest right now?",
    "I hear you. Did something specific happen today, or has this been building?",
    "That makes sense. Who do you usually turn to when things feel like this?",
    "I’m glad you said something. What kind of help do you think you need right now?"
  ];

  return supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)];
};

// Opening greeting (sets expectation: short-term + human focus)
export const getSimpleGreeting = () => {
  return (
    "Hey. I’m here for brief check-ins and support. " +
    "I can help you sort your thoughts and figure out next steps, " +
    "but I’m not meant to replace real people. " +
    "What’s going on for you right now?"
  );
};
