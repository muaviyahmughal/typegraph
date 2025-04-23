"use client";

import React from 'react';

interface TextCanvasProps {
  selectedFont: string | null;
  text: string;
  onTextChange: (newText: string) => void;
}

export const TextCanvas: React.FC<TextCanvasProps> = ({selectedFont, text, onTextChange}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(e.target.value);
  };

  return (
    <div className="border rounded-md p-4">
      <h2 className="text-xl font-semibold mb-2">Text Canvas</h2>
      <textarea
        className="w-full h-48 border rounded-md p-2 resize-none"
        value={text}
        onChange={handleChange}
        placeholder="Enter text here..."
      />
      <p className="mt-2">
        Selected Font: {selectedFont || 'Default'}
      </p>
    </div>
  );
};

