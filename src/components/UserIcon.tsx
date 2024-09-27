/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/components/UserIcon.tsx
 * PROGRAM NAME   : UserIcon.tsx
 *                : ユーザーアイコン
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/firebase/firebaseClient";

const UserIcon = () => {

  const {currentUser} = useAuth();
  const photoURL = currentUser?.photoURL ? currentUser.photoURL : undefined;

  const router = useRouter();

  //-----------------------------------------//
  // useEffect：副作用レンダリング以外の処理
  //-----------------------------------------//
  useEffect(() => {

    // ユーザーがログインしていない場合
    if (!currentUser) {
        router.push("/login");
    }

  }, [currentUser]);


  //-----------------------------------------//
  // ログアウト関数
  //-----------------------------------------//
  const handleLogout = () => {

    signOut(auth)
      .then(() => {
        // router.push("/login");
      })
      .catch((error) => {
        console.log(error);
      });

  }


  /////////////////////////////////////////////
  // 画面表示
  /////////////////////////////////////////////
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-8 w-8">
          <AvatarImage src={photoURL} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{currentUser?.displayName}</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleLogout}>ログアウト</DropdownMenuItem>
      </DropdownMenuContent>

    </DropdownMenu>

  );

};

export default UserIcon;
