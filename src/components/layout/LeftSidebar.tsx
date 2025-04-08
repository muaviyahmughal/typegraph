"use client";

import { motion } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Slider } from "../ui/slider";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Toggle } from "../ui/toggle";
import { Input } from "../ui/input";
import { Wand2, Type, Download, Bold, Italic, Underline } from "lucide-react";
import { useTypography } from "@/contexts/TypographyContext";

export function LeftSidebar() {
  const { style, updateStyle } = useTypography();

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="h-[calc(100vh-3.5rem)] w-[300px] border-r bg-background p-4 overflow-y-auto"
    >
      <Tabs defaultValue="typography" className="h-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="typography">
            <Type className="h-4 w-4 mr-2" />
            Type
          </TabsTrigger>
          <TabsTrigger value="effects">
            <Wand2 className="h-4 w-4 mr-2" />
            Effects
          </TabsTrigger>
          <TabsTrigger value="export">
            <Download className="h-4 w-4 mr-2" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="typography" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>
                Adjust typography settings and properties.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Font Size */}
              <div className="space-y-2">
                <Label>Font Size</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[style.fontSize]}
                    onValueChange={([value]) => updateStyle({ fontSize: value })}
                    min={8}
                    max={200}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={style.fontSize}
                    onChange={(e) => updateStyle({ fontSize: Number(e.target.value) })}
                    className="w-20"
                  />
                </div>
              </div>
              <Separator />

              {/* Text Style Toggles */}
              <div className="space-y-2">
                <Label>Text Style</Label>
                <div className="flex gap-2">
                  <Toggle
                    pressed={style.fontWeight === 700}
                    onPressedChange={(pressed) =>
                      updateStyle({ fontWeight: pressed ? 700 : 400 })
                    }
                    aria-label="Toggle bold"
                  >
                    <Bold className="h-4 w-4" />
                  </Toggle>
                  <Toggle
                    pressed={style.italic}
                    onPressedChange={(pressed) =>
                      updateStyle({ italic: pressed })
                    }
                    aria-label="Toggle italic"
                  >
                    <Italic className="h-4 w-4" />
                  </Toggle>
                  <Toggle
                    pressed={style.underline}
                    onPressedChange={(pressed) =>
                      updateStyle({ underline: pressed })
                    }
                    aria-label="Toggle underline"
                  >
                    <Underline className="h-4 w-4" />
                  </Toggle>
                </div>
              </div>
              <Separator />

              {/* Letter Spacing */}
              <div className="space-y-2">
                <Label>Letter Spacing</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[style.letterSpacing || 0]}
                    onValueChange={([value]) => updateStyle({ letterSpacing: value })}
                    min={-5}
                    max={20}
                    step={0.5}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={style.letterSpacing || 0}
                    onChange={(e) => updateStyle({ letterSpacing: Number(e.target.value) })}
                    className="w-20"
                  />
                </div>
              </div>
              <Separator />

              {/* Line Height */}
              <div className="space-y-2">
                <Label>Line Height</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[style.lineHeight || 1]}
                    onValueChange={([value]) => updateStyle({ lineHeight: value })}
                    min={0.5}
                    max={3}
                    step={0.1}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={style.lineHeight || 1}
                    onChange={(e) => updateStyle({ lineHeight: Number(e.target.value) })}
                    className="w-20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="effects" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vector Effects</CardTitle>
              <CardDescription>
                Apply vector-based effects to your text.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Vector effects controls will go here */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Bitmap Effects</CardTitle>
              <CardDescription>
                Apply bitmap transformations and filters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Bitmap effects controls will go here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>
                Choose format and export your design.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Export options will go here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
