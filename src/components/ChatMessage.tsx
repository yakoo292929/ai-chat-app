  /**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/components/ChatMessage.tsx
 * PROGRAM NAME   : ChatMessage.tsx
 *                : チャットメッセージ
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

"use client";

import React, { useEffect, useRef, useState } from "react";
import BotAvatar from "./BotAvatar";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import { ChatMessageProps, Message } from "@/types";
import { db } from "@/lib/firebase/firebaseClient";
import UserAvatar from "@/components/UserAvatar";
import Panel from "@/components/Panel";
import TextMessage from "@/components/TextMessage";
import ImageMessage from "@/components/ImageMessage";
import { cn } from "@/lib/utils";
import AudioMessage from "./AudioMessage";

const ChatMessage = ({chatId, chatType}: ChatMessageProps) => {

  //-----------------------------------------//
  // useState：状態管理
  //-----------------------------------------//
  const [messages, setMessages] = useState<Message[]>([]);

  //-----------------------------------------//
  // useEffect：副作用レンダリング以外の処理
  //-----------------------------------------//
  const endRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  //-----------------------------------------//
  // useEffect：副作用レンダリング以外の処理
  //-----------------------------------------//
  useEffect(() => {

    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("created_at", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapShot) => {
      const fetchMessages = snapShot.docs.map((doc) => (
        {
          id: doc.id,
          content: doc.data().content,
          type: doc.data().type,
          sender: doc.data().sender,
          created_at: doc.data().created_at,
        }
      ));
      setMessages(fetchMessages);

    });

    // クリーンアップ[監視終了]
    return () => unsubscribe();

  }, [chatId]);

  //-----------------------------------------//
  // メッセージコンポーネント取得関数
  //-----------------------------------------//
  const getMessageComponent = (message:Message) => {

    switch(message.type) {

      case "text":
      return <TextMessage content={message.content} />

      case "image":
      return <ImageMessage images={message.content} />

      case "audio":
      return <AudioMessage src={message.content} />

    }
    
  };


  /////////////////////////////////////////////
  // 画面表示
  /////////////////////////////////////////////
  return (

    <>
      {!chatId ? (
        <Panel chatType={chatType} />
      ) : (
        <div className="flex-1 p-4 space-y-4 overflow-auto">
          {messages.map((message) => (

            <div key={message.id} className="flex space-x-4">
              {message.sender === "user" ? (
                <UserAvatar />
              ) : (
                <BotAvatar />
              )}
              <div className={cn(message.type === "image" ? "flex-1" : "")}>
                {/* メッセージのタイプによってタグを変更する */}
                <div>{getMessageComponent(message)}</div>
              </div>
            </div>
          ))}
          <div ref={endRef}></div>
        </div>
      )}
    </>


  );

};

export default ChatMessage;
