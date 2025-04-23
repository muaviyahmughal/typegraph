import React from 'react';
import {Button} from "@/components/ui/button";
import { fabric } from 'fabric';

interface ExportControlsProps {
  text: string;
  selectedFont: string | null;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  kerning: number;
}

export const ExportControls: React.FC<ExportControlsProps> = ({text, selectedFont, bold, italic, underline, kerning}) => {

  const handleSvgExport = () => {
    const canvasElement = document.querySelector('canvas');
    if (!canvasElement) {
      alert("Canvas not found!");
      return;
    }

    const fabricCanvas = new fabric.Canvas(canvasElement);
    const svgContent = fabricCanvas.toSVG();

    const blob = new Blob([svgContent], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'TypeForge_export.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePngJpegExport = () => {
    const canvasElement = document.querySelector('canvas');
    if (!canvasElement) {
      alert("Canvas not found!");
      return;
    }

    const fabricCanvas = new fabric.Canvas(canvasElement);
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 0.8
    });

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'TypeForge_export.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Export</h2>
      <Button onClick={handleSvgExport} className="mb-2">Export as SVG</Button>
      <Button onClick={handlePngJpegExport}>Export as PNG/JPEG</Button>
    </div>
  );
};

