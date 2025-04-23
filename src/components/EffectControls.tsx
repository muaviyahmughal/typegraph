"use client";

import React from 'react';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";

export const EffectControls: React.FC = () => {
  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Effect Controls</h2>
      <Accordion type="single" collapsible>
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

