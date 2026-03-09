// src/services/llmService.js

import { generateHealthyAIPrompt, enhanceWithHealthySuggestions, getHealthyFallbackResponse } from '../data/healthyAIBrain';

// Configuration for different LLM providers
const LLM_CONFIG = {
  // OpenAI GPT
  openai: {
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    maxTokens: 200, // Keep responses short!
    temperature: 0.7
  },
  
  // Anthropic Claude (if you prefer)
  anthropic: {
    apiUrl: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-sonnet-20240229',
    maxTokens: 200,
    temperature: 0.7
  },
  
  // Local/self-hosted option
  local: {
    apiUrl: 'https://haal-ollama.onrender.com/api/generate',
    model: 'tinyllama',  // Use the model you just pulled
    maxTokens: 150  // Shorter for healthier conversations
  }
};

// Current provider - change this based on your preference
const CURRENT_PROVIDER = 'openai';

class HealthyLLMService {
  constructor() {
    this.config = LLM_CONFIG[CURRENT_PROVIDER];
    this.apiKey = process.env.EXPO_PUBLIC_LLM_API_KEY; // Set in your .env file
  }

  async generateHealthyResponse(userMessage, userPersonality, conversationHistory = []) {
    try {
      // Generate the healthy AI prompt
      const promptData = generateHealthyAIPrompt(userMessage, userPersonality, conversationHistory);
      
      // Handle crisis situations immediately without LLM
      if (promptData.responseType === 'crisis') {
        return {
          message: "I'm really worried about you. Please reach out for immediate help:\n\n• Crisis Text Line: Text HOME to 741741\n• National Suicide Prevention Lifeline: 988\n• Emergency: 911\n\nYou matter, and there are people trained to help.",
          type: 'crisis',
          includeResources: true
        };
      }

      // Call the appropriate LLM
      let aiResponse;
      switch (CURRENT_PROVIDER) {
        case 'openai':
          aiResponse = await this.callOpenAI(promptData);
          break;
        case 'anthropic':
          aiResponse = await this.callAnthropic(promptData);
          break;
        case 'local':
          aiResponse = await this.callLocalLLM(promptData);
          break;
        default:
          throw new Error('Unknown LLM provider');
      }

      // Enhance response with healthy suggestions
      const enhancedResponse = enhanceWithHealthySuggestions(aiResponse, promptData);

      return {
        message: enhancedResponse,
        type: 'healthy_ai',
        mood: promptData.responseType,
        shouldTransition: promptData.shouldTransition
      };

    } catch (error) {
      console.error('LLM Service Error:', error);
      
      // Fallback to rule-based responses if LLM fails
      const fallbackResponse = getHealthyFallbackResponse(
        promptData?.responseType || 'default',
        conversationHistory.filter(msg => msg.isUser).length
      );

      return {
        message: fallbackResponse,
        type: 'fallback',
        mood: 'neutral'
      };
    }
  }

  async callOpenAI(promptData) {
    const response = await fetch(this.config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: promptData.systemPrompt
          },
          {
            role: 'user',
            content: promptData.userContext
          }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        stop: ['\n\n\n'] // Prevent overly long responses
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  async callAnthropic(promptData) {
    const response = await fetch(this.config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        system: promptData.systemPrompt,
        messages: [
          {
            role: 'user',
            content: promptData.userContext
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text.trim();
  }

  async callLocalLLM(promptData) {
    // Example for Ollama or other local LLM
    const response = await fetch(this.config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.config.model,
        prompt: `${promptData.systemPrompt}\n\nUser Context: ${promptData.userContext}\n\nResponse:`,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: this.config.maxTokens
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Local LLM Error: ${response.status}`);
    }

    const data = await response.json();
    return data.response.trim();
  }

  // Method to test if the LLM service is working
  async testConnection() {
    try {
      const testResponse = await this.generateHealthyResponse(
        "I'm feeling a bit anxious today",
        "Thoughtful Creator",
        []
      );
      return { success: true, response: testResponse };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const healthyLLMService = new HealthyLLMService();

// Helper function to validate environment setup
export const validateLLMSetup = () => {
  const apiKey = process.env.EXPO_PUBLIC_LLM_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️ LLM API key not found. Add EXPO_PUBLIC_LLM_API_KEY to your .env file');
    return false;
  }

  console.log('✅ LLM service configured for:', CURRENT_PROVIDER);
  return true;
};

// Export for easy switching between providers
export const switchLLMProvider = (provider) => {
  if (LLM_CONFIG[provider]) {
    CURRENT_PROVIDER = provider;
    console.log('Switched to LLM provider:', provider);
    return true;
  }
  console.error('Unknown LLM provider:', provider);
  return false;
};