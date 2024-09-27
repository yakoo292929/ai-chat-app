import { NextResponse } from "next/server";
import OpenAI from "openai";
import path from "path";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const filePath = path.resolve("./public/audio/speech.mp3")

export async function GET(req: Request, res: Response) {

  const mp3 = await openai.audio.speech.create({
    model: "tts-1-hd",
    voice: "nova",
    input: "本日はお日柄もよく絶好の散歩日和です。",
    speed: 4.0,
  });

  // 変換処理
  const arraryBuffer = await mp3.arrayBuffer();
  const buffer = Buffer.from(arraryBuffer);

  await fs.promises.writeFile(filePath, buffer);

  return NextResponse.json("success");

}

