import React, { createContext, useContext, useState } from "react";

export type Conversation = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
};

const initialConversations: Conversation[] = [
  {
    id: "1",
    name: "Tom Clancy",
    avatar: "https://i.pravatar.cc/300?img=4",
    lastMessage: "Sounds good! I can help tomorrow at 3pm",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    unread: 2,
  },
  {
    id: "2",
    name: "Ashley Chen",
    avatar: "https://i.pravatar.cc/300?img=5",
    lastMessage: "Thanks again for helping with the groceries!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    unread: 0,
  },
  {
    id: "3",
    name: "Mike Torres",
    avatar: "https://i.pravatar.cc/300?img=7",
    lastMessage: "Hey, still need help with the dog walk?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unread: 1,
  },
  {
    id: "4",
    name: "Sarah Kim",
    avatar: "https://i.pravatar.cc/300?img=21",
    lastMessage: "Yes, I’m free this weekend!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    unread: 0,
  },
];

type MessagesContextType = {
  conversations: Conversation[];
  updateConversationLastMessage: (id: string, newText: string) => void;
};

const MessagesContext = createContext<MessagesContextType | undefined>(
  undefined
);

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);

  const updateConversationLastMessage = (id: string, newText: string) => {
    setConversations((prev) =>
      [...prev]
        .map((c) =>
          c.id === id
            ? {
                ...c,
                lastMessage: newText,
                timestamp: new Date(),
                // you could also bump unread here if you want
              }
            : c
        )
        .sort(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime() // newest first
        )
    );
  };

  return (
    <MessagesContext.Provider value={{ conversations, updateConversationLastMessage }}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const ctx = useContext(MessagesContext);
  if (!ctx) throw new Error("useMessages must be used within MessagesProvider");
  return ctx;
}
