/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/components/TextMessage.tsx
 * PROGRAM NAME   : TextMessage.tsx
 *                : テキストメッセージ
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

import React from "react";
import MessageDisplay from "@/components/MessageDisplay";

const TextMessage = ({ content }: { content: string } ) => {
  return (
    
    <div className="bg-white p-4 rounded-lg shadow break-all whitespace-pre-wrap">
      <MessageDisplay content={ content }/>
    </div>

  );

};

export default TextMessage;
