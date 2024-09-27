/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/components/Panel.tsx
 * PROGRAM NAME   : Panel.tsx
 *                : パネル
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

import React from "react";
import Image from "next/image";

const Panel = ({chatType}: {chatType: string}) => {

  //-----------------------------------------//
  // パネル選択関数
  //-----------------------------------------//
  const getChatConfig = () => {

    let imageUrl = "";
    let message = "";

    switch(chatType) {
      case "conversation":
        imageUrl = "/conversation_panel.svg";
        message = "会話を始めよう！";
      break;

      case "image_generation":
        imageUrl = "/image_generation_panel.svg";
        message = "画像を生成しよう！";
      break;

      case "text_to_speech":
        imageUrl = "/text_to_speech_panel.svg";
        message = "テキストを音声に変換しよう！";
      break;

      case "speech_to_text":
        imageUrl = "/speech_to_text_panel.svg";
        message = "音声をテキストに変換しよう！";
      break;

      case "image_analysis":
        imageUrl = "/image_analysis_panel.svg";
        message = "画像を解析しよう！";
      break;
    }
    return {imageUrl, message};
  }

  // パネル選択
  const {imageUrl, message} = getChatConfig();

  /////////////////////////////////////////////
  // 画面表示
  /////////////////////////////////////////////
  return (
    <div className="h-full flex flex-col items-center justify-center">
        <div className="relative h-72 w-72">
        <Image
          alt="Empty"
          fill
          src={imageUrl}
          priority
        />
        </div>
        <p className="text-muted-foreground text-sm text-center">{message}</p>
    </div>
  );

};

export default Panel;
