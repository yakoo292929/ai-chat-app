/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/lib/formConfigrations.ts
 * PROGRAM NAME   : formConfigrations.ts
 *                : formConfig
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

import { ChatFormData, ChatType } from "@/types";
import { conversationSchema, imageGenerationSchema, textToSpeechSchema } from "./validationSchema";

//-----------------------------------------//
// 画像枚数 セレクトオプション
//-----------------------------------------//
export const amountOptions = [
  {
    value: "1",
    label: "1枚",
  },
  {
    value: "2",
    label: "2枚",
  },
  {
    value: "3",
    label: "3枚",
  },
  {
    value: "4",
    label: "4枚",
  },
];

//-----------------------------------------//
// 画像サイズ セレクトオプション
//-----------------------------------------//
export const sizeOptions = [
  {
    value: "256x256",
    label: "256x256",
  },
  {
    value: "512x512",
    label: "512x512",
  },
  {
    value: "1024x1024",
    label: "1024x1024",
  },
];

//-----------------------------------------//
// フォーム初期設定値
//-----------------------------------------//
const formConfig = {

  conversation: {schema: conversationSchema, defaultValue: {prompt: ""}},
  image_generation: {schema: imageGenerationSchema, defaultValue: {prompt: "", amount: "1", size: "256x256"}},
  text_to_speech: {schema: textToSpeechSchema, defaultValue: {prompt: ""}},

  speech_to_text: {schema: conversationSchema, defaultValue: {prompt: ""}},
  image_analysis: {schema: conversationSchema, defaultValue: {prompt: ""}},

}

//-----------------------------------------//
// フォーム初期設定
//-----------------------------------------//
export const getFormConfig = (chatType: ChatType) => {

  return formConfig[chatType];

}

//-----------------------------------------//
// APIパラメーター取得
//-----------------------------------------//
export const getRequestData = (values: ChatFormData, chatId: string, chatType: ChatType) => {

  let apiUrl = "";
  let apiData = {};

  switch(chatType) {
    case "conversation":
      apiUrl = "/api/conversation";
      apiData = {
        prompt: values.prompt,
        chatId: chatId,
      };
    break;

    case "image_generation":
      apiUrl = "/api/image_generation";
      apiData = {
        prompt: values.prompt,
        amount: values.amount,
        size: values.size,
        chatId: chatId,
      };
    break;

    case "text_to_speech":
      apiUrl = "/api/text_to_speech";
      apiData = {
        prompt: values.prompt,
        chatId: chatId,
      };
    break;

  }
  return {apiUrl, apiData};

}

