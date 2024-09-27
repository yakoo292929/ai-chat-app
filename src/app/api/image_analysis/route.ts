import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export async function GET(req: Request, res: Response) {

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "2つの画像には何が映っていますか?" },
          // 1枚目の画像
          {
            type: "image_url",
            image_url: {
              "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
            },
          },
          // 2枚目の画像
          {
            type: "image_url",
            image_url: {
              "url": "https://picsum.photos/id/237/1024",
            },
          },
        ],
      },

    ],


  });
  console.log(response.choices[0]);

  return NextResponse.json(response);

}

