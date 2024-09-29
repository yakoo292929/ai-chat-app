/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/components/MobaileSidebar.tsx
 * PROGRAM NAME   : MobaileSidebar.tsx
 *                : モバイルサイドバー
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

import Sidebar from "./Sidebar";

const MobaileSidebar = () => {

  /////////////////////////////////////////////
  // 画面表示
  /////////////////////////////////////////////
  return (

    <Sheet>

      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden hover:bg-transparent">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="p-0 w-72">
        <SheetHeader>
          <SheetTitle className="hidden">Title</SheetTitle>
          <SheetDescription className="hidden">Description</SheetDescription>
        </SheetHeader>
        <Sidebar />
      </SheetContent>

    </Sheet>

  );
  
};

export default MobaileSidebar;
