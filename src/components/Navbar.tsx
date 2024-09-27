/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/components/Navbar.tsx
 * PROGRAM NAME   : Sidebar.tsx
 *                : ナビバー
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

import React from "react";

import MobaileSidebar from "./MobaileSidebar";
import UserIcon from "@/components/UserIcon";

const Navbar = () => {

  /////////////////////////////////////////////
  // 画面表示
  /////////////////////////////////////////////
  return (
    <div className="flex items-center p-3">
      <MobaileSidebar />
      <div className="w-full flex justify-end">
        <UserIcon />
      </div>
    </div>
  );
};

export default Navbar;
