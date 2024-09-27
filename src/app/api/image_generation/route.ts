/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/app/api/image_generation/route.tsx
 * PROGRAM NAME   : route.tsx
 *                : 画像生成生成API
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

export async function POST(req: Request, res: Response) {

  try {

    // ユーザーメッセージ取得
    const { prompt, amount, size, chatId } = await req.json();

    // ユーザーメッセージをfirestoreに保存
    await db.collection("chats").doc(chatId).collection("messages").add({
      content: prompt,
      created_at: FieldValue.serverTimestamp(),
      sender: 'user',
      type: 'text',
    });

    // opneAI APIを呼び出してAIの回答を生成
    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt: prompt,
      n: parseInt(amount, 10),
      size: size,
    });
    const image_url = response.data[0].url;

    // URL -> ダウンロード -> バイナリー変換 -> 保存パスを設定 -> ストレージにアップロード
    const imageDataPromises = response.data.map(async(item) => {
      if (item.url) {
          // ダウンロード
          const response = await fetch(item.url);
          // バイナリー変換
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          // 保存パスを設定
          const filePath = `6fUBpnpeqlT95FV4pW8GsC5BRvA2/chatRoom/${chatId}`;
          // ストレージにアップロード
          return await fileUploadToStorage(buffer, filePath, "image/png");

      }
    });
    const urls = await Promise.all(imageDataPromises);
    console.log("urls:", urls);


    // AIの回答をfirestoreに保存
    await db.collection("chats").doc(chatId).collection("messages").add({
      content: urls,
      created_at: FieldValue.serverTimestamp(),
      sender: 'assistant',
      type: 'image',
    });


  } catch(error) {
    console.log("IMAGE_GENERATION ERROR", error);
    return NextResponse.json({ error: "サーバー側でエラーが発生しました"});
  }

  return NextResponse.json({success: "true"})
}

