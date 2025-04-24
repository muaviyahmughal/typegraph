import React, { useState } from 'react';
import {Button} from "@/components/ui/button";
import * as fabric from 'fabric';
import { saveAs } from 'file-saver';
import Select from 'react-select';

interface ExportControlsProps {
  text: string;
  canvas: fabric.Canvas | null;
  selectedFont: string | null;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  kerning: number;
}

interface Option {
  value: 'svg' | 'png' | 'jpeg';
  label: string;
}

const options: Option[] = [
  { value: 'svg', label: 'SVG' },
  { value: 'png', label: 'PNG' },
  { value: 'jpeg', label: 'JPEG' },
];

export const ExportControls: React.FC<ExportControlsProps> = ({ canvas, text, selectedFont, bold, italic, underline, kerning }) => {
  const [selectedFormat, setSelectedFormat] = useState<Option>(options[1]); 

  const handleExport = () => {
    if (!canvas) {
      alert("Canvas not ready!");
      return; 
    }
    
    if (selectedFormat.value === 'svg') {
      const svgContent = canvas.toSVG();
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      saveAs(blob, 'TypeForge_export.svg');
    } else if (selectedFormat.value === 'png') {
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
      });
      const byteString = atob(dataURL.split(',')[1]);
      const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      saveAs(blob, 'TypeForge_export.png');
    } else if (selectedFormat.value === 'jpeg') {
        const dataURL = canvas.toDataURL({ format: 'jpeg', quality: 1 });
        const byteString = atob(dataURL.split(',')[1]);
        const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) { ia[i] = byteString.charCodeAt(i); }
        const blob = new Blob([ab], { type: mimeString });
        saveAs(blob, 'TypeForge_export.jpeg');
    }
  }

  
  return (
    <div className='flex flex-col gap-4'>
      <h2 className="text-lg font-semibold mb-2">Export</h2>
      <Select options={options} defaultValue={selectedFormat} onChange={setSelectedFormat} className="basic-single" classNamePrefix="select"/>
      <Button onClick={handleExport}>Export</Button>
    </div>
  );
};
