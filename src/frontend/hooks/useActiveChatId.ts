import { useContext } from 'react';
import { ChatContext } from './../components'; // Create a custom hook to use the ChatContext

/**
 * Hook to retrieve the custom context containing the active chat id.
 *
 * This chad id is used to determine which chat should be rendered in the chat UI.
 */

export const useActiveChatId = () => {
  return useContext(ChatContext);
};
