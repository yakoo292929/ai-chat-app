/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/app/api/speech_to_text/route.tsx
 * PROGRAM NAME   : route.tsx
 *                : 音声テキスト変換API
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import OpenAI from "openai";
import { fileUploadToStorage } from "@/lib/firebase/storage";

//-----------------------------------------//
// OpenAI
//-----------------------------------------//
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {

  try {

    // ユーザーフォーム取得
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const chatId = formData.get("chatId") as string;
    // console.log(file);
    // console.log(chatId);

    // ファイルバリデーションチェック
    // if (!file || !(file instanceof File)) {
    //     return NextResponse.json({ error: "No file provider"}, { status: 400 });
    // }

    // 1.バイナリー変換 -> 2.保存パスを設定 -> 3.ストレージにアップロード
    // 1.バイナリー変換
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    // 2.保存パスを設定
    const filePath = `6fUBpnpeqlT95FV4pW8GsC5BRvA2/chatRoom/${chatId}`;
    // 3.ストレージにアップロード
    const url = await fileUploadToStorage(buffer, filePath, file.type);
    // console.log("url", url);

    // ユーザーメッセージをfirestoreに保存
    await db.collection("chats").doc(chatId).collection("messages").add({
      content: url,
      created_at: FieldValue.serverTimestamp(),
      sender: 'user',
      type: 'audio',
    });

    // opneAI APIを呼び出してAIの回答を生成
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
    });
    console.log("transcription", transcription);
    console.log("transcription.text", transcription.text);
    const aiResponse = transcription.text;

    // AIの回答をfirestoreに保存
    await db.collection("chats").doc(chatId).collection("messages").add({
      content: aiResponse,
      created_at: FieldValue.serverTimestamp(),
      sender: 'assistant',
      type: 'text',
    });


  } catch(error) {

    console.log("SPEECH_TO_TEXT ERROR", error);
    return NextResponse.json({ error: "サーバー側でエラーが発生しました"});
    
  }

  return NextResponse.json({success: "true"});

}

