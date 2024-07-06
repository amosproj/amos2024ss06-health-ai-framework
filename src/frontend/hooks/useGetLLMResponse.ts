import { useState, useEffect, useCallback } from 'react';
import type { conversationMessage } from '../types';

export function useGetLLMResponse(model: string, conversation: conversationMessage) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [LLMResponse, setLLMResponse] = useState<string | undefined>(undefined);
  const [LLMResponseError, setError] = useState<string | undefined>(undefined);

  const fetchLLMResponse = useCallback(async (query: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:5000/llm-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, model }), // Include model in the request
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setLLMResponse(data.response);
    } catch (error) {
      setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  }, [model]); // Add model as a dependency

  useEffect(() => {
    if (conversation) {
      fetchLLMResponse(conversation.content);
    }
  }, [conversation, fetchLLMResponse]);

  return { LLMResponse, isGenerating, LLMResponseError };
}