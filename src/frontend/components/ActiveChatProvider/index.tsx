import React, {
  type ReactNode,
  createContext,
  useState,
  useContext,
  type Dispatch,
  type SetStateAction
} from 'react';

/**
 * This file is a context provider for the active chat id.
 */

// Define the shape of the context value
interface ChatContextValue {
  activeChatId: string;
  setActiveChatId: Dispatch<SetStateAction<string>>;
}

// Define the default context value
const defaultContextValue: ChatContextValue = {
  activeChatId: 'default',
  setActiveChatId: () => {}
};

// Create a context with the default value
export const ChatContext = createContext<ChatContextValue>(defaultContextValue);

type ActiveChatProviderProps = {
  children: ReactNode;
};

// Create a provider component
export const ActiveChatProvider = (props: ActiveChatProviderProps) => {
  const [activeChatId, setActiveChatId] = useState<string>('default'); // initial active chat id is -1
  const { children } = props;

  return (
    <ChatContext.Provider value={{ activeChatId, setActiveChatId }}>
      {children}
    </ChatContext.Provider>
  );
};
