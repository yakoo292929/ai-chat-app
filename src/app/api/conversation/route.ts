/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/app/api/conversation/route.tsx
 * PROGRAM NAME   : route.tsx
 *                : テキスト生成API
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import OpenAI from "openai";

//-----------------------------------------//
// OpenAI
//-----------------------------------------//
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {

  try {

    // ユーザーメッセージ取得
    const { prompt, chatId } = await req.json();

    // ユーザーメッセージをfirestoreに保存
    await db.collection("chats").doc(chatId).collection("messages").add({
      content: prompt,
      created_at: FieldValue.serverTimestamp(),
      sender: 'user',
      type: 'text',
    });

    // firestoreからユーザーメッセージ取得
    const messagesRef = db.collection("chats").doc(chatId).collection("messages");
    const snapShot = await messagesRef.orderBy("created_at", "asc").get();

    const messages = snapShot.docs.map((doc) => (
      {
        role: doc.data().sender,
        content: doc.data().content,
      }
    ));
    console.log("messages", messages);

    // opneAI APIを呼び出してAIの回答を生成
    const completion = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-4o-mini",
    });
    const aiResponse = completion.choices[0].message.content;
    console.log("AI_RESPONSE", aiResponse);

    // AIの回答をfirestoreに保存
    await db.collection("chats").doc(chatId).collection("messages").add({
      content: aiResponse,
      created_at: FieldValue.serverTimestamp(),
      sender: 'assistant',
      type: 'text',
    });


  } catch(error) {

    console.log("CONVERSATION ERROR", error);
    return NextResponse.json({ error: "サーバー側でエラーが発生しました"});

  }

  return NextResponse.json({success: "true"})
}
