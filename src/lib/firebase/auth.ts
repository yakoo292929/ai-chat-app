/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/lib/firebase/auth.ts
 * PROGRAM NAME   : auth.ts
 *                : 認証
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

import { getAuth } from "firebase-admin/auth";
import { db } from "./firebaseAdmin";

export async function verifyToken(token: string) {

  try {

    // デコード処理
    const decodedToken = await getAuth().verifyIdToken(token);
    return decodedToken;

  } catch(error) {

    console.log("IDトークンの検証エラー", error);
    // throw new Error("無効なトークンです。");
    return null;
    
  }

}

export async function checkUserPermission(uid: string, chatId: string) {

  try {

    const chatRef = db.collection("chats").doc(chatId);
    const chatDoc = await chatRef.get();
    if (!chatDoc.exists) {
        return false;
    }
    const chatData = chatDoc.data();
    console.log("chatData", chatData);

    return chatData?.user_id === uid;

  } catch(error) {

    console.log("ユーザー権限のチェックエラー", error);
    throw new Error("ユーザー権限のチェックに失敗しました。");

  }

}
