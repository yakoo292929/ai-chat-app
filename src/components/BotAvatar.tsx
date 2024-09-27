/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/components/BotAvatar.tsx
 * PROGRAM NAME   : BotAvatar.tsx
 *                : ボットアバター
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const BotAvatar = () => {

  /////////////////////////////////////////////
  // 画面表示
  /////////////////////////////////////////////
  return (

    <Avatar className="h-8 w-8">
      <AvatarImage src="/ai_logo.svg" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>

  );

};

export default BotAvatar;
