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

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { LoaderCircle, Paperclip, Send } from "lucide-react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChatFormData, ChatFormProps } from "@/types";
import { db } from "@/lib/firebase/firebaseClient";
import { amountOptions, getFormConfig, getRequestData, sizeOptions } from "@/lib/formConfigurations";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "./ui/input";
import Image from "next/image";

const ChatForm = ({chatId, chatType, setChatId}: ChatFormProps) => {

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { currentUser } = useAuth();
  const { schema, defaultValue } = getFormConfig(chatType);

  //-----------------------------------------//
  // useState：状態管理
  //-----------------------------------------//
  const [audio, setAudio] = useState<File | null>(null);


  //-----------------------------------------//
  // zodバリデーションチェック
  //-----------------------------------------//
  const form = useForm<ChatFormData>({
    defaultValues: defaultValue,
    resolver: zodResolver(schema),
  });

  const isSubmitting = form.formState.isSubmitting;

  //-----------------------------------------//
  // ファイル変更取得関数
  //-----------------------------------------//
  const handleFileChange = (files: FileList | null) => {

    // エラーチェック
    if (!files || files.length === 0) return;

    const file = files[0];
    form.setValue("file", file);
    setAudio(file);

  }

  //-----------------------------------------//
  // ファーストメッセージ選択関数
  //-----------------------------------------//
  const selectFirstMessage = (values: ChatFormData, chatType: string) => {
    switch(chatType) {
      case "speech_to_text":
        return values.file.name;

      default:
        return values.prompt;

    }

  }

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
            first_message: selectFirstMessage(values, chatType),
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

    } finally {

      if (fileInputRef.current) {
          fileInputRef.current.value = "";
      }

      // オーディオ選択解除
      if (chatType === "speech_to_text") {
         setAudio(null);
      }

      // フォームリセット
      form.reset();

    }

  }

  //-----------------------------------------//
  // ファイルプレビューコンポーネント
  //-----------------------------------------//
  const FilePreview = () => (
    <div className="flex flex-wrap gap-2 mb-4">

        {audio && (
        <div className="flex items-center gap-2 p-4 rounded-lg">
            <div className="relative h-10 w-10">
                <Image src={"/audio_file.svg"} fill alt="audio_file" />
            </div>
            <p>{audio.name}</p>
        </div>
        )}

    </div>
  )

  /////////////////////////////////////////////
  // 画面表示
  /////////////////////////////////////////////
  return (
    <div className="bg-white p-3">

        {audio && (
          <FilePreview />
        )}

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

              {/* ファイル選択 */}
              {(chatType === "speech_to_text" || chatType === "image_analysis") && (
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field: {value, ref, onChange,  ...filedProps} }) => (
                    <FormItem>
                      <FormLabel><Paperclip/></FormLabel>
                      <FormControl>
                        <Input
                          ref={(e) => {
                            fileInputRef.current = e;
                            ref(e);
                          }}
                          className="hidden"
                          type="file"
                          multiple
                          onChange={(event) => {
                            const files = event.target.files;
                            handleFileChange(files);
                          }}
                          {...filedProps}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

            {/* テキストインプット */}
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem className="w-full flex-1">
                    <FormControl>
                      <Textarea
                        disabled={isSubmitting || chatType === "speech_to_text"}
                        {...field}
                        className="bg-slate-100"
                        placeholder={chatType === "speech_to_text" ? "入力できません" : "チャットを始めよう！"}
                      />
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
