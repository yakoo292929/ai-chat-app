/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/context/AuthContext.tsx
 * PROGRAM NAME   : AuthContext.tsx
 *                : 認証コンテキスト
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase/firebaseClient";
import { UserInfo } from "firebase/auth";

//-----------------------------------------//
// interface：型定義
//-----------------------------------------//
interface AuthContextState {
  currentUser: UserInfo | null
  userToken: string | null
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);

export const AuthContextProvider = ( {children}: {children: ReactNode} ) => {

  //-----------------------------------------//
  // useState：状態管理
  //-----------------------------------------//
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  //-----------------------------------------//
  // useEffect：副作用レンダリング以外の処理
  //-----------------------------------------//
  useEffect(() => {

    const unsubscribe = auth.onIdTokenChanged(async(user) => {
      if (user) {
          setCurrentUser(user);
          const token = await  user.getIdToken();
          setUserToken(token);
      } else {
          setCurrentUser(null);
          setUserToken(null);
      }
      setIsLoading(false);
    });

    // クリーンアップ[監視終了]
    return () => unsubscribe();

  }, []);

  return (
    <AuthContext.Provider value={ {currentUser, userToken} }>
      {!isLoading && children}
    </AuthContext.Provider>
  );

}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
      throw new Error("contextはAuthProvider内で取得する必要があります。");
  }
  return context;

}
