"use client";

import React, { createContext, useContext, useState } from "react";
import { TextStyle } from "@/lib/CanvasManager";

interface TypographyContextType {
  style: TextStyle;
  setText: (text: string) => void;
  updateStyle: (updates: Partial<TextStyle>) => void;
  text: string;
}

const defaultStyle: TextStyle = {
  fontFamily: "Inter",
  fontSize: 48,
  fontWeight: 400,
  color: "#000000",
  italic: false,
  underline: false,
  letterSpacing: 0,
  lineHeight: 1.5,
};

const TypographyContext = createContext<TypographyContextType | null>(null);

export function TypographyProvider({ children }: { children: React.ReactNode }) {
  const [style, setStyle] = useState<TextStyle>(defaultStyle);
  const [text, setText] = useState("Type something...");

  const updateStyle = (updates: Partial<TextStyle>) => {
    setStyle((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  return (
    <TypographyContext.Provider value={{ style, text, setText, updateStyle }}>
      {children}
    </TypographyContext.Provider>
  );
}

export function useTypography() {
  const context = useContext(TypographyContext);
  if (!context) {
    throw new Error("useTypography must be used within a TypographyProvider");
  }
  return context;
}
