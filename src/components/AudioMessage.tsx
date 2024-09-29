/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/components/AudioMessage.tsx
 * PROGRAM NAME   : ImageMessage.tsx
 *                : オーディオメッセージ
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

import React from "react";

const AudioMessage = ({ src }: { src: string }) => {

  /////////////////////////////////////////////
  // 画面表示
  /////////////////////////////////////////////
  return (
    <audio controls src={src}></audio>
  );
  
};

export default AudioMessage;
