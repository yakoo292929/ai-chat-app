/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/lib/validationSchema.ts
 * PROGRAM NAME   : validationSchema.ts
 *                : バリデーションスキーマ
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

import { z } from "zod";

const MAX_AUDIO_FILE_SIZE = 1024 * 1024 * 20;  // 20MB
const ACCEPTED_AUDIO_FORMATS = [
  "audio/flac",
  "video/mpeg",
  "audio/mpeg",
  "video/mp4",
  "audio/mp4",
  "audio/aac",
  "audio/ogg",
  "audio/vnd.wav",
  "audio/wav",
  "video/webm",
]
const ACCEPTED_AUDIO_EXTENSION = [
  "flac",
  "mp3",
  "mp4",
  "mpeg",
  "m4a",
  "ogg",
  "wav",
  "webm",
]

//-----------------------------------------//
// conversationSchema用バリデーション
//-----------------------------------------//
export const conversationSchema = z.object({
  prompt: z
    // 型
    .string()
    // 最小文字数
    .min(1,{message: "1文字以上入力して下さい。"}),
});

//-----------------------------------------//
// imageGenerationSchema用バリデーション
//-----------------------------------------//
export const imageGenerationSchema = z.object({
  prompt: z
    // 型
    .string()
    // 最小文字数
    .min(1,{message: "1文字以上入力して下さい。"})
    // 最小文字数
    .max(1000,{message: "1000文字以内入力して下さい。"}),
  amount: z
    // 型
    .string(),
  size: z
    // 型
    .string(),
});

//-----------------------------------------//
// textToSpeechSchema用バリデーション
//-----------------------------------------//
export const textToSpeechSchema = z.object({
  prompt: z
    // 型
    .string()
    // 最小文字数
    .min(1,{message: "1文字以上入力して下さい。"})
    // 最小文字数
    .max(4096,{message: "4096文字以内入力して下さい。"}),
});

//-----------------------------------------//
// speechToTextSchema用バリデーション
//-----------------------------------------//
export const speechToTextSchema = z.object({
  file: z
    // 型
    .instanceof(File, {message: "ファイルを選択してください。"})
    // 最大サイズ
    .refine((file) => file.size <= MAX_AUDIO_FILE_SIZE, {message: "20MB以下のファイルを選択してください。"})
    // ファイル形式
    .refine((file) => {
      // MIMEタイプ
      const fileTypeValied =  ACCEPTED_AUDIO_FORMATS.includes(file.type);
      // 拡張子
      const fileExtensionValied =  ACCEPTED_AUDIO_EXTENSION.includes(file.name.split(".").pop()!);
      return fileTypeValied && fileExtensionValied;
    }, {message: "対応していないファイルタイプです。"})
});
