"use client";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { useTypography } from "@/contexts/TypographyContext";

const FONTS = [
  { name: "Inter", value: "Inter" },
  { name: "Arial", value: "Arial" },
  { name: "Helvetica", value: "Helvetica" },
  { name: "Times New Roman", value: "Times New Roman" },
  { name: "Georgia", value: "Georgia" },
];

export function TopBar() {
  const { style, updateStyle } = useTypography();

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
      <div className="flex flex-1 items-center justify-start gap-6">
        {/* Logo */}
        <div className="font-semibold">Typegraph</div>
        
        <Separator orientation="vertical" className="h-6" />

        {/* Font Family Selector */}
        <div className="flex gap-2 items-center">
          <Select
            value={style.fontFamily}
            onValueChange={(value) => updateStyle({ fontFamily: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              {FONTS.map((font) => (
                <SelectItem
                  key={font.value}
                  value={font.value}
                  style={{ fontFamily: font.value }}
                >
                  {font.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
