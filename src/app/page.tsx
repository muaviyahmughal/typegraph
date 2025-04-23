"use client";

import React, {useState} from 'react';
import {TextCanvas} from '@/components/TextCanvas';
import {EffectControls} from '@/components/EffectControls';
import {FontControls} from '@/components/FontControls';
import {Sidebar} from '@/components/ui/sidebar';
import {ModeToggle} from '@/components/ModeToggle';

export default function Home() {
  const [selectedFont, setSelectedFont] = useState<string | null>(null);
  const [text, setText] = useState<string>('TypeForge');

  return (
    <div className="flex h-screen w-full">
      <Sidebar className="w-64 flex-none p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">TypeForge</h1>
          <ModeToggle />
        </div>
        <FontControls onFontSelect={setSelectedFont} />
        <EffectControls />
      </Sidebar>

      <main className="flex-1 p-4">
        <TextCanvas selectedFont={selectedFont} text={text} onTextChange={setText} />
      </main>
    </div>
  );
}

