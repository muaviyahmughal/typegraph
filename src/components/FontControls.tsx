"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as opentype from 'opentype.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider"; // Assuming shadcn/ui slider
import { Label } from "@/components/ui/label";
import { getSystemFonts, Font as SystemFont } from '@/services/font-service';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { useForm } from "react-hook-form"

// Interface for axis data extracted from opentype.js
interface FontAxis {
  tag: string;
  minValue: number;
  maxValue: number;
  defaultValue: number;
  name?: string; // May not always be present
}

// Updated interface for our font list
interface DisplayFont {
  name: string;
  isUploaded?: boolean;
  axes?: { [tag: string]: FontAxis };
  defaultWeight?: number;
}

interface FontControlsProps {
  onFontSelect: (font: string | null) => void;
  onVariableSettingsChange?: (settings: Record<string, number> | null) => void;
  onBoldChange: (bold: boolean) => void;
  onItalicChange: (italic: boolean) => void;
  onUnderlineChange: (underline: boolean) => void;
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

export const FontControls: React.FC<FontControlsProps> = ({ onFontSelect, onVariableSettingsChange, onBoldChange, onItalicChange, onUnderlineChange, bold, italic, underline }) => {
  const [systemFonts, setSystemFonts] = useState<SystemFont[]>([]);
  const [uploadedFonts, setUploadedFonts] = useState<DisplayFont[]>([]);
  const [allFonts, setAllFonts] = useState<DisplayFont[]>([]);
  const [selectedFontInfo, setSelectedFontInfo] = useState<DisplayFont | null>(null);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

    const form = useForm({
    defaultValues: {
      bold: bold,
      italic: italic,
      underline: underline,
    },
  })

  function handleBoldChange(value: boolean) {
    form.setValue("bold", value);
    onBoldChange(value);
  }

  function handleItalicChange(value: boolean) {
    form.setValue("italic", value);
    onItalicChange(value);
  }

  function handleUnderlineChange(value: boolean) {
    form.setValue("underline", value);
    onUnderlineChange(value);
  }

  // Fetch system fonts
  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const fonts = await getSystemFonts();
        setSystemFonts(fonts);
      } catch (error) {
        console.error("Failed to fetch system fonts:", error);
        toast({ title: "Error", description: "Failed to load system fonts.", variant: "destructive" });
      }
    };
    fetchFonts();
  }, [toast]);

  // Combine fonts when lists change
  useEffect(() => {
    const combinedFonts = [
      ...systemFonts.map(f => ({ name: f.name, isUploaded: false })),
      ...uploadedFonts
    ].sort((a, b) => a.name.localeCompare(b.name));
    setAllFonts(combinedFonts);
  }, [systemFonts, uploadedFonts]);

  // Effect to handle variable settings change
  useEffect(() => {
    if (selectedFontInfo?.axes?.wght && currentWeight !== null) {
      onVariableSettingsChange?.({ 'wght': currentWeight });
    } else {
      // Reset if font is not variable or no weight selected
      onVariableSettingsChange?.(null);
    }
  }, [currentWeight, selectedFontInfo, onVariableSettingsChange]);

  // Handle font selection from dropdown
  const handleFontSelect = useCallback((fontName: string) => {
    const fontInfo = allFonts.find(f => f.name === fontName);
    setSelectedFontInfo(fontInfo || null);
    onFontSelect(fontName);

    // Set initial weight if variable font with weight axis is selected
    if (fontInfo?.axes?.wght) {
      setCurrentWeight(fontInfo.defaultWeight ?? fontInfo.axes.wght.defaultValue);
    } else {
      setCurrentWeight(null);
    }
  }, [allFonts, onFontSelect]);

  // Handle slider value change
  const handleWeightChange = (value: number[]) => {
    setCurrentWeight(value[0]);
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle File Upload and Parsing
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log(`Uploading file: ${file.name}, MIME Type: ${file.type}`);

    // Validation (MIME + Extension Fallback)
    const allowedMimeTypes = ['font/ttf', 'font/otf', 'font/woff', 'font/woff2', 'application/font-woff', 'application/font-woff2', 'application/vnd.ms-opentype', 'application/x-font-ttf'];
    const allowedExtensions = ['.ttf', '.otf', '.woff', '.woff2'];
    let isValid = false;
    if (file.type && allowedMimeTypes.includes(file.type)) isValid = true;
    else if (!file.type || file.type === 'application/octet-stream') {
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (allowedExtensions.includes(ext)) {
        console.log(`Allowing based on extension '${ext}'.`);
        isValid = true;
      }
    }
    if (!isValid) {
      toast({ title: "Invalid File Type", description: `File ${file.name} not supported.`, variant: "destructive" });
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const fontData = e.target?.result as ArrayBuffer;
        if (!fontData) throw new Error("Failed to read file.");

        const font = opentype.parse(fontData);
        const fontName = file.name.replace(/\.[^/.]+$/, "");

        if (allFonts.some(f => f.name.toLowerCase() === fontName.toLowerCase())) {
          toast({ title: "Font Already Exists", description: `Font "${fontName}" is already available.`, variant: "warning" });
          return; // Keep input value for reset later
        }

        const newFont: DisplayFont = { name: fontName, isUploaded: true };

        // Check for variable font data ('fvar' table)
        if (font.tables.fvar && font.tables.fvar.axes) {
          console.log(`Font "${fontName}" is a variable font.`);
          newFont.axes = {};
          font.tables.fvar.axes.forEach((axis: opentype.VariationAxis) => {
            newFont.axes![axis.tag] = {
              tag: axis.tag,
              minValue: axis.minValue,
              maxValue: axis.maxValue,
              defaultValue: axis.defaultValue,
              name: axis.name?.en // Assuming English name
            };
            console.log(` > Axis: ${axis.tag}, Min: ${axis.minValue}, Max: ${axis.maxValue}, Default: ${axis.defaultValue}`);
          });
          // Store default weight from OS/2 table if available, otherwise use fvar default
          newFont.defaultWeight = font.tables.os2 ? font.tables.os2.usWeightClass : newFont.axes?.wght?.defaultValue;
        }

        const fontFace = new FontFace(fontName, fontData);
        await fontFace.load();
        document.fonts.add(fontFace);

        setUploadedFonts(prev => [...prev, newFont]);
        handleFontSelect(fontName); // Select the new font

        toast({ title: "Font Uploaded", description: `Font "${fontName}" loaded ${newFont.axes ? ' (Variable)' : ''}.` });

      } catch (error: any) {
        console.error("Error loading/parsing font:", error);
        toast({ title: "Font Load Error", description: `Could not load font ${file.name}. ${error.message}`, variant: "destructive" });
      } finally {
        event.target.value = ''; // Reset file input here
      }
    };
    reader.onerror = () => {
      console.error("Error reading file:", reader.error);
      toast({ title: "File Read Error", description: `Could not read file ${file.name}.`, variant: "destructive" });
      event.target.value = ''; // Reset on error too
    };
    reader.readAsArrayBuffer(file);
  };

  // Determine selected font's weight axis details
  const weightAxis = selectedFontInfo?.axes?.wght;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Font Controls</h2>
      {/* Font Selection Dropdown */}
      <Select onValueChange={handleFontSelect} value={selectedFontInfo?.name || ""}>
        <SelectTrigger>
          <SelectValue placeholder="Select a font" />
        </SelectTrigger>
        <SelectContent>
          {allFonts.length === 0 && systemFonts.length === 0 && (
            <SelectItem value="loading" disabled>Loading...</SelectItem>
          )}
          {allFonts.map((font) => (
            <SelectItem key={font.name} value={font.name}>
              {font.name}{font.isUploaded ? " (Up)" : ""}{font.axes ? " (Var)" : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Variable Font Weight Slider (Conditional) */}
      {weightAxis && currentWeight !== null && (
        <div className="space-y-2">
          <Label htmlFor="weight-slider">Weight ({currentWeight})</Label>
          <Slider
            id="weight-slider"
            min={weightAxis.minValue}
            max={weightAxis.maxValue}
            step={1} // Common step for weight is 1
            value={[currentWeight]}
            onValueChange={handleWeightChange}
          />
        </div>
      )}

            <Accordion type="single" collapsible>
      <AccordionItem value="textProperties">
          <AccordionTrigger>Text Properties</AccordionTrigger>
          <AccordionContent>
          <Form {...form}>
      <FormField
        control={form.control}
        name="bold"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <FormLabel>Bold</FormLabel>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={handleBoldChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="italic"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <FormLabel>Italic</FormLabel>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={handleItalicChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
            <FormField
        control={form.control}
        name="underline"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <FormLabel>Underline</FormLabel>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={handleUnderlineChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </Form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Font Upload Section */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".ttf,.otf,.woff,.woff2"
        style={{ display: 'none' }}
      />
      <Button
        variant="secondary"
        className="w-full"
        onClick={handleUploadButtonClick}
      >
        Upload Custom Font
      </Button>
    </div>
  );
};
