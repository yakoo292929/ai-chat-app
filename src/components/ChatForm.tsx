/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/components/ChatForm.tsx
 * PROGRAM NAME   : ChatForm.tsx
 *                : チャット入力フォーム
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { LoaderCircle, Send } from "lucide-react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChatFormData, ChatFormProps } from "@/types";
import { db } from "@/lib/firebase/firebaseClient";
import { amountOptions, getFormConfig, getRequestData, sizeOptions } from "@/lib/formConfigurations";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ChatForm = ({chatId, chatType, setChatId}: ChatFormProps) => {

  const router = useRouter();
  const { currentUser } = useAuth();
  const { schema, defaultValue } = getFormConfig(chatType);

  //-----------------------------------------//
  // zodバリデーションチェック
  //-----------------------------------------//
  const form = useForm<ChatFormData>({
    defaultValues: defaultValue,
    resolver: zodResolver(schema),
  });

  const isSubmitting = form.formState.isSubmitting;


  //-----------------------------------------//
  // チャット更新関数
  //-----------------------------------------//
  const onSubmit = async(values: ChatFormData) => {
    console.log(values.amount);

    // チャットルーム作成
    try {
      let chatRef;
      let isNewChat = false;
      if (!chatId) {
          // 初めてのメッセージを送信した場合
          const newChatDocRef = await addDoc(collection(db, "chats"), {
            first_message: values.prompt,
            last_updated: serverTimestamp(),
            type: chatType,
            user_id: currentUser?.uid,
          });
          chatRef = doc(db, "chats", newChatDocRef.id);
          isNewChat = true;
          setChatId(newChatDocRef.id);
      } else {
          // 既にチャットルームにアクセスしている場合
          chatRef = doc(db, "chats", chatId);
      }

      // APIパラメーター取得
      const {apiUrl, apiData} = getRequestData(values, chatRef.id, chatType);
      // API実行
      const respose = await axios.post(apiUrl, apiData);

      if (isNewChat) {
          // 初めてメッセージを送信した場合
          window.history.pushState(null, "", `/${chatType}/${chatRef.id}`);
      } else {
          // 既にチャットルームにアクセスしている場合
          await updateDoc(chatRef, {
            last_updated: serverTimestamp(),
          });
      }


    } catch(error) {
      console.error(error);
    } finally{
      // フォームリセット
      form.reset();
    }

  }

  /////////////////////////////////////////////
  // 画面表示
  /////////////////////////////////////////////
  return (
    <div className="bg-white p-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>

            {chatType === "image_generation" && (
              <div className="flex items-center space-x-2">

                {/* 画像数 */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <Select
                        disabled={isSubmitting}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a verified email to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {amountOptions.map((option) =>(
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* 画像サイズ */}
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <Select
                        disabled={isSubmitting}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a verified email to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sizeOptions.map((option) =>(
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

              </div>
            )}

            <div className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem className="w-full flex-1">
                    <FormControl>
                      <Textarea disabled={isSubmitting} {...field} className="bg-slate-100" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button  disabled={isSubmitting} variant={"ghost"}>
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin"/>
                ) : (
                  <Send />
                )}
              </Button>
            </div>
          </form>
        </Form>
    </div>

  );

};

export default ChatForm;
