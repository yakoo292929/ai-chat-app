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

//-----------------------------------------//
// conversationSchema用バリデーション
//-----------------------------------------//
export const conversationSchema = z.object({
  prompt: z
    .string().min(1,{message: "1文字以上入力して下さい。"}),
});

//-----------------------------------------//
// imageGenerationSchema用バリデーション
//-----------------------------------------//
export const imageGenerationSchema = z.object({
  prompt: z
    .string()
    .min(1,{message: "1文字以上入力して下さい。"})
    .max(1000,{message: "1000文字以内入力して下さい。"}),
  amount: z
    .string(),
  size: z
    .string(),
});

//-----------------------------------------//
// textToSpeechSchema用バリデーション
//-----------------------------------------//
export const textToSpeechSchema = z.object({
  prompt: z
    .string()
    .min(1,{message: "1文字以上入力して下さい。"})
    .max(4096,{message: "4096文字以内入力して下さい。"}),
});
