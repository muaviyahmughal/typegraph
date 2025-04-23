import React from 'react';
import {Button} from "@/components/ui/button";

interface ExportControlsProps {
  text: string;
  selectedFont: string | null;
}

export const ExportControls: React.FC<ExportControlsProps> = ({text, selectedFont}) => {

  const handleSvgExport = () => {
    // Create SVG content
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100">
      <text x="10" y="50" font-family="${selectedFont || 'Arial'}" font-size="20">${text}</text>
    </svg>`;

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
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 600; // Increased width
    canvas.height = 300; // Increased height
    const ctx = canvas.getContext('2d');
  
    if (!ctx) {
      alert("Canvas context not supported!");
      return;
    }
  
    // Set background color to white (or any preferred color)
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // Set font properties
    ctx.font = `30px ${selectedFont || 'Arial'}`; // Increased font size
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center'; // Center the text
    ctx.textBaseline = 'middle'; // Align text vertically
  
    // Calculate the middle point of the canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
  
    // Draw the text onto the canvas
    ctx.fillText(text, centerX, centerY);
  
    canvas.toBlob((blob) => {
      if (blob === null) {
        console.error("Failed to create blob");
        return;
      }
  
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'TypeForge_export.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
  
    }, 'image/png'); // You can change to 'image/jpeg' if needed
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Export</h2>
      <Button onClick={handleSvgExport} className="mb-2">Export as SVG</Button>
      <Button onClick={handlePngJpegExport}>Export as PNG/JPEG</Button>
    </div>
  );
};
