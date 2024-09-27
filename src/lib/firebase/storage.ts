/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/lib/firebase/storage.ts
 * PROGRAM NAME   : storage.ts
 *                : ストレージ保管
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

import { bucket } from "./firebaseAdmin";
import { v4 as uuidv4 } from "uuid";

export const fileUploadToStorage = async(
  buffer: Buffer,
  filePath: string,
  contentType: string
) => {
  try {
    const randomFileName = uuidv4();
    const fileExtension = contentType === "audio/mpeg" ? "mp3" : contentType.split("/")[1];
    const fileName = `${filePath}/${randomFileName}.${fileExtension}`;
    const uploadFile = bucket.file(fileName);

    await uploadFile.save(buffer, {
      metadata: {
        contentType: contentType
      }
    });

    await uploadFile.makePublic();

    return `https://storage.googleapis.com/${bucket.name}/${fileName}`;

  } catch(error: any) {
    console.log(error);
    throw new Error("ファイルのアップロードに失敗しました。", error.messages);
  }

};
