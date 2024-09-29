/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/types/index.ts
 * PROGRAM NAME   : index.ts
 *                : 型定義
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

import { Timestamp } from "firebase/firestore";

export type ChatFormData = {
  prompt: string;
  amount: string;
  size: string;
  file: File;
  files: File[];
}

export interface ChatProps {
  initialChatId?: string;
  chatType: ChatType;
}

export interface ChatMessageProps {
  chatId?: string;
  chatType: string;
}

export interface ChatRoom {
  id: string;
  type: string;
  first_message: string;
  user_id: string;
  last_updated: Timestamp;
}

export interface ChatFormProps {
  chatId?: string;
  chatType: ChatType;
  setChatId: React.Dispatch<React.SetStateAction<string | undefined>>
}

export interface TextMessage {
  id: string;
  content: string;
  type: "text";
  sender: "user" | "assistant";
  created_at: Timestamp;
}

export interface ImageMessage {
  id: string;
  content: string[];
  type: "image";
  sender: "user" | "assistant";
  created_at: Timestamp;
}

export interface AudioMessage {
  id: string;
  content: string;
  type: "audio";
  sender: "user" | "assistant";
  created_at: Timestamp;
}

export interface ImageAnalysisMessage {
  id: string;
  content: { imageUrl: string[], text: string };
  type: "image_analysis";
  sender: "user" | "assistant";
  created_at: Timestamp;
}

export type Message = TextMessage | ImageMessage | AudioMessage | ImageAnalysisMessage;

export type ChatType =
  | "conversation"
  | "image_generation"
  | "text_to_speech"
  | "speech_to_text"
  | "image_analysis"
