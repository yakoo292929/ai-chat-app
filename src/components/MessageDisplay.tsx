/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/components/MessageDisplay.tsx
 * PROGRAM NAME   : MessageDisplay.tsx
 *                : メッセージディスプレイ
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

import React from "react";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const MessageDisplay = ({ content }: {content: string}) => {

  /////////////////////////////////////////////
  // 画面表示
  /////////////////////////////////////////////
  return (

    <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
    
  );

};

export default MessageDisplay;
