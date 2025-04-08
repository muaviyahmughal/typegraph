"use client";

import { TopBar } from "@/components/layout/TopBar";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { MainCanvas } from "@/components/layout/MainCanvas";

export default function Home() {
  return (
    <main className="flex h-screen flex-col overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <MainCanvas />
      </div>
    </main>
  );
}
