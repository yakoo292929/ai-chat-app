/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/app/api/image_generation/route.tsx
 * PROGRAM NAME   : route.tsx
 *                : 画像生成API
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
    const { prompt, amount, size, chatId } = await req.json();

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

    // opneAI APIを呼び出してAIの回答を生成
    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt: prompt,
      n: parseInt(amount, 10),
      size: size,
    });
    const image_url = response.data[0].url;

    // URL -> 1.ダウンロード -> 2.バイナリー変換 -> 3.保存パスを設定 -> 4.ストレージにアップロード
    const imageDataPromises = response.data.map(async(item) => {
      if (item.url) {
          // 1.ダウンロード
          const response = await fetch(item.url);
          // 2.バイナリー変換
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          // 3.保存パスを設定
          const filePath = `${user.uid}/chatRoom/${chatId}`;
          // 4.ストレージにアップロード
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

  return NextResponse.json({success: "true"});

}

