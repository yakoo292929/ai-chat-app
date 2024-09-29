/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/app/api/image_analysis/route.tsx
 * PROGRAM NAME   : route.tsx
 *                : 画像解析API
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
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

//-----------------------------------------//
// OpenAI
//-----------------------------------------//
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {

  try {

    // ユーザーメッセージ取得
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const prompt = formData.get("prompt") as string;
    const chatId = formData.get("chatId") as string;
    console.log(files);
    console.log(prompt);
    console.log(chatId);

    let urls: string[] = [];

    if (files.length > 0) {
        // 1.バイナリー変換 -> 2.保存パスを設定 -> 3.ストレージにアップロード
        const imageDataPromises = files.map(async(file) => {
          // 1.バイナリー変換
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          // 2.保存パスを設定
          const filePath = `6fUBpnpeqlT95FV4pW8GsC5BRvA2/chatRoom/${chatId}`;
          // 3.ストレージにアップロード
          return await fileUploadToStorage(buffer, filePath, file.type);
        });
        urls = await Promise.all(imageDataPromises);
        console.log("urls:", urls);
    }

    // ユーザーメッセージをfirestoreに保存
    await db.collection("chats").doc(chatId).collection("messages").add({
      content: {text:prompt, imageUrl: urls},
      created_at: FieldValue.serverTimestamp(),
      sender: 'user',
      type: 'image_analysis',
    });

    // firestoreからユーザーメッセージ取得
    const messagesRef = db.collection("chats").doc(chatId).collection("messages");
    const snapShot = await messagesRef.orderBy("created_at", "asc").get();

    const messages: ChatCompletionMessageParam[] = snapShot.docs.map((doc) => {

      if (doc.data().sender === "user") {
          // ユーザーメッセージ
          return {
            role: "user",
            content: [
              // テキスト
              { type: "text", text: doc.data().content.text },
              // 画像
              ...doc.data().content.imageUrl.map((url: string) => {
                return {
                  type: "image_url",
                  image_url: {
                    "url": url,
                  },
                }
              })
            ],
          }
      } else {
          // AIメッセージ
          return {
            role: "assistant",
            content: doc.data().content,
          }
      }

    });
    console.log("messages", messages);

    // opneAI APIを呼び出してAIの回答を生成
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
    });
    console.log(response.choices[0]);
    const aiResponse = response.choices[0].message.content;

    // AIの回答をfirestoreに保存
    await db.collection("chats").doc(chatId).collection("messages").add({
      content: aiResponse,
      created_at: FieldValue.serverTimestamp(),
      sender: 'assistant',
      type: 'text',
    });

  } catch(error) {

    console.log("IMAGE_ANALYSIS ERROR", error);
    return NextResponse.json({ error: "サーバー側でエラーが発生しました"});

  }

  return NextResponse.json({success: "true"});

}

