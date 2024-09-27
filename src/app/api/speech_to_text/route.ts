import { NextResponse } from "next/server";
import OpenAI from "openai";
import path from "path";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export async function GET(req: Request, res: Response) {

  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream("./public/audio/speech.wav"),
    model: "whisper-1",
    temperature: 1,
    language: "ja",
  });

  console.log(transcription.text);

  return NextResponse.json("transcription");

}

