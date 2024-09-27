/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/app/(dashboad)/[chatType]/[chatId]/page.tsx
 * PROGRAM NAME   : page.tsx
 *                : チャットルーム画面
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

import React from "react";
import { notFound } from "next/navigation";
import Chat from "@/components/Chat";
import { ChatType } from "@/types";

const ChatRoomPage = ( {params}: {params: {chatType: string, chatId: string}} ) => {

  const {chatId, chatType} = params;

  //-----------------------------------------//
  // 型ガード関数 許可ページ
  //-----------------------------------------//
  const isChatTypeKey = (key: string): key is ChatType =>
    [
      "conversation",
      "image_generation",
      "text_to_speech",
      "speech_to_text",
      "image_analysis",
    ].includes(key);

  // 型ガードチェック
  if (!isChatTypeKey(chatType)) {
      return notFound();
  }

  /////////////////////////////////////////////
  // 画面表示
  /////////////////////////////////////////////
  return (

    <Chat initialChatId={chatId} chatType={chatType} />

  );

};

export default ChatRoomPage;
