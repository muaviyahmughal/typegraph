"use client";

import React from 'react';
import {Textarea} from "@/components/ui/textarea";

interface TextCanvasProps {
  selectedFont: string | null;
  text: string;
  onTextChange: (newText: string) => void;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  kerning: number;
}

export const TextCanvas: React.FC<TextCanvasProps> = ({selectedFont, text, onTextChange, bold, italic, underline, kerning}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(e.target.value);
  };

  return (
    <div className="flex flex-col h-full border rounded-md p-4">
      <h2 className="text-xl font-semibold mb-2">Text Canvas</h2>
      <Textarea
        className="flex-grow w-full border rounded-md p-2 resize-none"
        value={text}
        onChange={handleChange}
        placeholder="Enter text here..."
        style={{
          fontFamily: selectedFont || 'sans-serif',
          fontWeight: bold ? 'bold' : 'normal',
          fontStyle: italic ? 'italic' : 'normal',
          textDecoration: underline ? 'underline' : 'none',
          letterSpacing: `${kerning / 100}em`,
        }}
      />
    </div>
  );
};
