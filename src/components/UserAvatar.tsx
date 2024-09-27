/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/components/UserAvatar.tsx
 * PROGRAM NAME   : UserAvatar.tsx
 *                : ユーザーアバター
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";


const UserAvatar = () => {

  const {currentUser} = useAuth();
  const photoURL = currentUser?.photoURL ? currentUser.photoURL : undefined;

  /////////////////////////////////////////////
  // 画面表示
  /////////////////////////////////////////////
  return (

    <Avatar className="h-8 w-8">
      <AvatarImage src={photoURL} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>

  );

};

export default UserAvatar;
