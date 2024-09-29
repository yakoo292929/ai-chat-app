/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/app/api/deleteChat/[chatId]/route.tsx
 * PROGRAM NAME   : route.tsx
 *                : チャット削除API
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

import { NextResponse } from "next/server";
import { bucket, db } from "@/lib/firebase/firebaseAdmin";
import { headers } from "next/headers";
import { checkUserPermission, verifyToken } from "@/lib/firebase/auth";

export async function DELETE(req:Request, {params}: {params: {chatId: string}} ) {

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

    // firestoreのデータを操作していいユーザーか？
    const hasPermission = await checkUserPermission(user.uid, params.chatId);
    // 権限有無チェック
    if (!hasPermission) {
        return NextResponse.json({ error: "操作が許可されていないか、リソースが存在しません。"}, {status: 403});
    }


    const {chatId} = params;
    // firestoreからデータ削除
    const chatRef = db.collection("chats").doc(chatId);
    await db.recursiveDelete(chatRef);

    // storageからデータを削除
    const prefix = `${user.uid}/chatRoom/${chatId}`;
    const [files] = await bucket.getFiles({prefix: prefix});

    if (files) {
        console.log(`${files.length}枚の削除対象のファイルがありました。`);
        const deletePromises = files.map((file) => file.delete());
        await Promise.all(deletePromises);
        console.log(`${files.length}枚のファイルを削除しました。`);
    } else {
      console.log(`削除対象のファイルがありませんでした。`);
    }
    return NextResponse.json({ message: "チャットルームとそのサブコレクションが削除されました"}, {status: 200});

  } catch(error) {

    console.log("削除処理中のエラー", error);
    return NextResponse.json({ error: "削除処理中にエラーが発生しました"}, {status: 500});

  }

}
