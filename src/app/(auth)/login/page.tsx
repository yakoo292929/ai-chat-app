/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/app/(auth)/page.tsx
 * PROGRAM NAME   : page.tsx
 *                : ログイン画面
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase/firebaseClient";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {

  const {currentUser} = useAuth();
  const router = useRouter();

  //-----------------------------------------//
  // useEffect：副作用レンダリング以外の処理
  //-----------------------------------------//
  useEffect(() => {

    // ユーザーがログインしている場合
    if (currentUser) {
        router.push("/conversation");
    }

  }, [currentUser]);


  //-----------------------------------------//
  // ログイン関数
  //-----------------------------------------//
  const handleLogin = () => {

    signInWithPopup(auth, provider)
      .then(() => {
        // router.push("/conversation");
      })
      .catch((error) => {
        console.log(error);
      });

  }

  /////////////////////////////////////////////
  // 画面表示
  /////////////////////////////////////////////
  return (
    <Button onClick={handleLogin}>login</Button>
  );

};

export default LoginPage;
