"use client";

import React, {useState, useEffect} from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {getSystemFonts, Font} from '@/services/font-service';
import {Button} from "@/components/ui/button";

interface FontControlsProps {
  onFontSelect: (font: string | null) => void;
}

export const FontControls: React.FC<FontControlsProps> = ({onFontSelect}) => {
  const [systemFonts, setSystemFonts] = useState<Font[]>([]);
  const [selectedFont, setSelectedFont] = useState<string | null>(null);

  useEffect(() => {
    const fetchFonts = async () => {
      const fonts = await getSystemFonts();
      setSystemFonts(fonts);
    };

    fetchFonts();
  }, []);

  const handleFontSelect = (font: string) => {
    setSelectedFont(font);
    onFontSelect(font);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Font Controls</h2>
      <Select onValueChange={handleFontSelect}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a font"/>
        </SelectTrigger>
        <SelectContent>
          {systemFonts.map((font) => (
            <SelectItem key={font.name} value={font.name}>
              {font.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="secondary" className="mt-2 w-full">Upload Font</Button>
    </div>
  );
};

