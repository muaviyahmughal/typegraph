import React from 'react';
import {Button} from "@/components/ui/button";

interface ExportControlsProps {
  text: string;
  selectedFont: string | null;
}

export const ExportControls: React.FC<ExportControlsProps> = ({text, selectedFont}) => {
  const handleExport = () => {
    const blob = new Blob([text], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'TypeForge_export.txt'; // You can customize the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Export</h2>
      <Button onClick={handleExport}>Export as Text</Button>
    </div>
  );
};
