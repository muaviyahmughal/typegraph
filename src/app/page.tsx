"use client";

import React, {useState} from 'react';
import * as fabric from 'fabric';
import {TextCanvas} from '@/components/TextCanvas';
import {FontControls} from '@/components/FontControls';
import {Sidebar} from '@/components/ui/sidebar';
import {ModeToggle} from '@/components/ModeToggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {ExportControls} from "@/components/ExportControls";

export default function Home() {
  const [selectedFont, setSelectedFont] = useState<string | null>(null);
  const [text, setText] = useState<string>('TypeForge');
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [kerning, setKerning] = useState<number>(0);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  const handleTextChangeAction = (newText: string) => {
    setText(newText);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar className="w-64 flex-none p-4 overflow-y-auto">
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
            <FontControls
              onFontSelectAction={setSelectedFont}
              onBoldChangeAction={setBold}
              onItalicChangeAction={setItalic}
              onUnderlineChangeAction={setUnderline}
              onKerningChangeAction={setKerning}
              bold={bold}
              italic={italic}
              underline={underline}
            />
          </TabsContent>
          <TabsContent value="effects">
          </TabsContent>
          <TabsContent value="export">
            <ExportControls 
              text={text} 
              selectedFont={selectedFont} 
              bold={bold} 
              italic={italic} 
              underline={underline} 
              kerning={kerning}
              canvas={canvas}
            />
          </TabsContent>
        </Tabs>
      </Sidebar>

      <main className="flex-1 p-4 overflow-hidden">
        <TextCanvas
          selectedFont={selectedFont}
          text={text}
          onTextChangeAction={handleTextChangeAction}
          onCanvasInit={setCanvas}
          bold={bold}
          italic={italic}
          underline={underline}
          kerning={kerning}
        />
      </main>
    </div>
  );
}
