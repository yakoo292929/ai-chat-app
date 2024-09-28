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

export async function DELETE(req:Request, {params}: {params: {chatId: string}} ) {
  try {

    const {chatId} = params;
    // firestoreからデータ削除
    const chatRef = db.collection("chats").doc(chatId);
    await db.recursiveDelete(chatRef);

    // storageからデータを削除
    const prefix = `6fUBpnpeqlT95FV4pW8GsC5BRvA2/chatRoom/${chatId}`;
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
