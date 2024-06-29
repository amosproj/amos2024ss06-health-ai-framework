import { useContext } from 'react';
import { ChatContext } from './../components'; // Create a custom hook to use the ChatContext

export const useActiveChatId = () => {
  return useContext(ChatContext);
};
