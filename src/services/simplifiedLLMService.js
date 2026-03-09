// src/services/simplifiedLLMService.js

import { generateSimplePrompt, getSimpleFallback, isCrisisMessage } from '../data/simplifiedHealthyAI';

const LLM_CONFIG = {
  openai: {
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    maxTokens: 150,
    temperature: 0.7
  }
};

class SimplifiedLLMService {
  constructor() {
    this.config = LLM_CONFIG.openai;
    this.apiKey = process.env.EXPO_PUBLIC_LLM_API_KEY;
  }

  async generateResponse(userMessage, conversationHistory = []) {
    try {
      const promptData = generateSimplePrompt(userMessage, conversationHistory);
      const response = await this.callLLM(promptData);
      
      return {
        message: response,
        type: promptData.isCrisis ? 'crisis' : 'supportive',
        shouldTransition: promptData.shouldTransition
      };

    } catch (error) {
      console.error('LLM Error:', error);
      
      const fallback = getSimpleFallback(
        userMessage, 
        conversationHistory.filter(msg => msg.isUser).length
      );
      
      return {
        message: fallback,
        type: 'fallback',
        shouldTransition: false
      };
    }
  }

  async callLLM(promptData) {
    const response = await fetch(this.config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          { role: 'system', content: promptData.systemPrompt },
          { role: 'user', content: promptData.userMessage }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }
}

export const simplifiedLLMService = new SimplifiedLLMService();