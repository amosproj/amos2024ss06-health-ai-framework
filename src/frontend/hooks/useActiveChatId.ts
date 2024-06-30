import { ChatContext } from './../components'; // Create a custom hook to use the ChatContext
import { useContext } from 'react';

export const useActiveChatId = () => {
  return useContext(ChatContext);
};
