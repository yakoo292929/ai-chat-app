/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/app/(dashboad)/[chatType]/not-found.tsx
 * PROGRAM NAME   : not-found.tsx
 *                : 404画面
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="relative h-72 w-72">
        <Image alt="NotFound" fill src={"/not-found.svg"} />
      </div>
      <p className="text-muted-foreground text-sm text-center">
        ページが見つかりません
      </p>
      <Link href="/conversation">Conversationページに戻る</Link>
    </div>
  );
}
