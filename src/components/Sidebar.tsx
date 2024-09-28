/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/components/Sidebar.tsx
 * PROGRAM NAME   : Sidebar.tsx
 *                : サイドバー
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import BotAvatar from "@/components/BotAvatar";
import { Ellipsis, FileImage, FileOutput, FileSearch2, MessageCircle, Speech } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { collection, onSnapshot, orderBy, query, Timestamp, where } from "firebase/firestore";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase/firebaseClient";
import { useAuth } from "@/context/AuthContext";
import { ChatRoom } from "@/types";
import axios from "axios";

const Sidebar = () => {

  const router = useRouter();

  // パス取得
  const pathname = usePathname();
  // ユーザー情報取得
  const {currentUser} = useAuth();
  // メニュー配列
  const routes = [
    {
      label: "テキスト生成",
      href: "/conversation",
      color: "text-violet-500",
      Icon: MessageCircle
    },
    {
      label: "画像生成",
      href: "/image_generation",
      color: "text-blue-500",
      Icon: FileImage
    },
    {
      label: "テキスト読み上げ",
      href: "/text_to_speech",
      color: "text-red-500",
      Icon: FileOutput
    },
    {
      label: "音声テキスト変換",
      href: "/speech_to_text",
      color: "text-green-500",
      Icon: Speech
    },
    {
      label: "画像解析",
      href: "/image_analysis",
      color: "text-orange-500",
      Icon: FileSearch2
    },
  ]

  //-----------------------------------------//
  // useState：状態管理
  //-----------------------------------------//
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  //-----------------------------------------//
  // useEffect：副作用レンダリング以外の処理
  //-----------------------------------------//
  useEffect(() => {

    if (!currentUser) return;

    const q = query(
      collection(db, "chats"),
      where("user_id", "==", currentUser?.uid),
      orderBy("last_updated", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapShot) => {
      const fetchChatRooms = snapShot.docs.map((doc) => (
        {
          id: doc.id,
          type: doc.data().type,
          first_message: doc.data().first_message,
          user_id: doc.data().user_id,
          last_updated: doc.data().last_updated,
        }
      ));
      setChatRooms(fetchChatRooms);
    });

    // クリーンアップ[監視終了]
    return () => unsubscribe();

  }, []);

  //-----------------------------------------//
  // Chat削除関数
  //-----------------------------------------//
  const handleDeleteChat = async(chatId: string) => {
    try {

      const response = await axios.delete(`/api/deleteChat/${chatId}`);
      console.log("response", response);
      router.push("/conversation");

    } catch(error) {

      console.error(error);

    }

  }

  /////////////////////////////////////////////
  // 画面表示
  /////////////////////////////////////////////
  return (

    <div className="bg-gray-700 text-white p-3 h-full space-y-4 flex flex-col">

      {/* タイトル＆ロゴエリア */}
      <Link href="/" className="flex items-center">
        <div className="mr-3 pl-1">
          <BotAvatar />
        </div>
        <h1 className="font-bold text-xl">AI Chat App</h1>
      </Link>

      {/* チャットタイプ */}
      <div className="space-y-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn("block p-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition rounded-lg",
              pathname.startsWith(route.href) && "bg-white/10"
            )}>
            <div className="flex items-center">
              <route.Icon className={cn("h-4 w-4, mr-1", route.color)}/>
              <p>{route.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* チャットルームエリア */}
      <div className="flex flex-1 flex-col overflow-hidden space-y-1">
        <h2 className="text-xs font-medium px-2 py-4">チャットルーム</h2>
        <div className="overflow-auto">

          {chatRooms.map((room) =>(
            <Link
              key={room.id}
              href={`/${room.type}/${room.id}`}
              className={cn("block p-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition rounded-lg",
                // pathname === `/${room.type}/${room.id}` && "bg-white/10"
              )}>
              <div className="flex items-center justify-between">
                <p className="font-medium truncate">{room.first_message}</p>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Ellipsis size={16}/>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleDeleteChat(room.id)}>削除</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Link>
          ))}

        </div>
      </div>

    </div>
  );
};

export default Sidebar;
