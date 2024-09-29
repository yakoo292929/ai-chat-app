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
import { headers } from "next/headers";
import { checkUserPermission, verifyToken } from "@/lib/firebase/auth";

//-----------------------------------------//
// OpenAI
//-----------------------------------------//
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {

  try {

    const headersList = headers();
    const authHeader = headersList.get('Authorization');
    // トークンが添付されているか？
    if (!authHeader) {
        return NextResponse.json({ error: "トークンが添付されていません。"}, {status: 401});
    }

    // デコード
    const token = authHeader.split("Bearer ")[1];
    const user =  await verifyToken(token);
    // トークン有効チェック
    if (!user) {
        return NextResponse.json({ error: "無効なトークンです。"}, {status: 401});
    }

    // ユーザーメッセージ取得
    const { prompt, chatId } = await req.json();

    // firestoreのデータを操作していいユーザーか？
    const hasPermission = await checkUserPermission(user.uid, chatId);
    // 権限有無チェック
    if (!hasPermission) {
        return NextResponse.json({ error: "操作が許可されていないか、リソースが存在しません。"}, {status: 403});
    }

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
