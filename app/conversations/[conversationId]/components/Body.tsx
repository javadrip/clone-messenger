"use client";

import { useRef, useState } from "react";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";

import MessageBox from "./MessageBox";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  // bottomRef facilitates scrolling to the bottom of the chat when the user gets a new message
  const bottomRef = useRef<HTMLDivElement>(null);

  // Extracts the conversationId
  const { conversationId } = useConversation();

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      {/* Exists only to facilitate scrolling to the bottom of the chat when the user gets a new message */}
      <div ref={bottomRef} className="pt-24" />
    </div>
  );
};

export default Body;
