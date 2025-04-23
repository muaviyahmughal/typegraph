"use client";

import React, {useState} from 'react';
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

interface EffectControlsProps {
  onBoldChange: (bold: boolean) => void;
  onItalicChange: (italic: boolean) => void;
  onUnderlineChange: (underline: boolean) => void;
}

export const EffectControls: React.FC<EffectControlsProps> = ({onBoldChange, onItalicChange, onUnderlineChange}) => {
  const form = useForm({
    defaultValues: {
      bold: false,
      italic: false,
      underline: false,
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
  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Text Controls</h2>
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
        <AccordionItem value="pixelation">
          <AccordionTrigger>Pixelation Effects</AccordionTrigger>
          <AccordionContent>
            <p>Controls for pixelation effects will be here.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="asciiArt">
          <AccordionTrigger>ASCII Art</AccordionTrigger>
          <AccordionContent>
            <p>Controls for ASCII art conversion will be here.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="smudge">
          <AccordionTrigger>Smudge Effects</AccordionTrigger>
          <AccordionContent>
            <p>Controls for smudge effects will be here.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="stippling">
          <AccordionTrigger>Stippling Effects</AccordionTrigger>
          <AccordionContent>
            <p>Controls for stippling effects will be here.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="matrix">
          <AccordionTrigger>Matrix Effects</AccordionTrigger>
          <AccordionContent>
            <p>Controls for matrix-style effects will be here.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
