"use client";

import React, {useState} from 'react';
import {TextCanvas} from '@/components/TextCanvas';
import {EffectControls} from '@/components/EffectControls';
import {FontControls} from '@/components/FontControls';
import {Sidebar} from '@/components/ui/sidebar';
import {ModeToggle} from '@/components/ModeToggle';
import {ExportControls} from '@/components/ExportControls';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [selectedFont, setSelectedFont] = useState<string | null>(null);
  const [text, setText] = useState<string>('TypeForge');
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);

  return (
    <div className="flex h-screen w-full">
      <Sidebar className="w-64 flex-none p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">TypeForge</h1>
          <ModeToggle />
        </div>
        <Tabs defaultValue="font" className="w-full">
          <TabsList>
            <TabsTrigger value="font">Font</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>
          <TabsContent value="font">
            <FontControls onFontSelect={setSelectedFont} />
          </TabsContent>
          <TabsContent value="effects">
            <EffectControls
              onBoldChange={setBold}
              onItalicChange={setItalic}
              onUnderlineChange={setUnderline}
            />
          </TabsContent>
          <TabsContent value="export">
            <ExportControls text={text} selectedFont={selectedFont} />
          </TabsContent>
        </Tabs>
      </Sidebar>

      <main className="flex-1 p-4">
        <TextCanvas
          selectedFont={selectedFont}
          text={text}
          onTextChange={setText}
          bold={bold}
          italic={italic}
          underline={underline}
        />
      </main>
    </div>
  );
}
