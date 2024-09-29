/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/components/Chat.tsx
 * PROGRAM NAME   : Chat.tsx
 *                : チャット画面
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

"use client";

import React, { useState } from "react";

import ChatMessage from "@/components/ChatMessage";
import ChatForm from "@/components/ChatForm";
import { ChatProps } from "@/types";

const Chat = ({initialChatId, chatType}: ChatProps) => {

  //-----------------------------------------//
  // useState：状態管理
  //-----------------------------------------//
  const [chatId, setChatId] = useState(initialChatId);


  /////////////////////////////////////////////
  // 画面表示
  /////////////////////////////////////////////
  return (

    <>
      <ChatMessage chatId={chatId} chatType={chatType} />
      <ChatForm setChatId={setChatId} chatId={chatId} chatType={chatType} />
    </>

  );

};

export default Chat;
