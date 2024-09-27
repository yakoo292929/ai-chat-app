/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/lib/firebase/firebaseAdmin.ts
 * PROGRAM NAME   : firebaseAdmin.ts
 *                : firebase管理者
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// 初期化されていない場合のみ初期化
if (!getApps().length) {
    initializeApp({
      credential: applicationDefault(),
      storageBucket: 'ai-chat-app-309c3.appspot.com'
    });
} else {
    getApp();
}

// FireStore FireStorage 初期化
const db = getFirestore();
const bucket = getStorage().bucket();

export {db, bucket };
