"use client";

import React, { useState, useRef, useEffect } from 'react';

interface TextCanvasProps {
  selectedFont: string | null;
  text: string;
  onTextChange: (newText: string) => void;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  kerning: number;
}

export const TextCanvas: React.FC<TextCanvasProps> = ({ selectedFont, text, onTextChange, bold, italic, underline, kerning }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [size, setSize] = useState({ width: 200, height: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeAnchor, setResizeAnchor] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set font styles
    ctx.font = `${bold ? 'bold ' : ''}${italic ? 'italic ' : ''}30px ${selectedFont || 'Arial'}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.letterSpacing = `${kerning / 100}em`;

    // Draw text
    ctx.fillText(text, position.x, position.y);

    // Draw bounding box
    ctx.strokeStyle = 'rgba(0, 0, 255, 0.3)'; // Subtle blue
    ctx.lineWidth = 1;
    ctx.strokeRect(position.x, position.y, size.width, size.height);

    // Draw resize anchors
    const anchorSize = 5;
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Subtle red

    // Top-left
    ctx.fillRect(position.x - anchorSize, position.y - anchorSize, anchorSize * 2, anchorSize * 2);
    // Top-right
    ctx.fillRect(position.x + size.width - anchorSize, position.y - anchorSize, anchorSize * 2, anchorSize * 2);
    // Bottom-left
    ctx.fillRect(position.x - anchorSize, position.y + size.height - anchorSize, anchorSize * 2, anchorSize * 2);
    // Bottom-right
    ctx.fillRect(position.x + size.width - anchorSize, position.y + size.height - anchorSize, anchorSize * 2, anchorSize * 2);

  }, [selectedFont, text, bold, italic, underline, kerning, position, size]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Check if mouse is over resize anchors
    const anchorSize = 5;
    if (mouseX >= position.x - anchorSize * 2 && mouseX <= position.x + anchorSize * 2 &&
      mouseY >= position.y - anchorSize * 2 && mouseY <= position.y + anchorSize * 2) {
      setIsResizing(true);
      setResizeAnchor('top-left');
      return;
    }
    if (mouseX >= position.x + size.width - anchorSize * 2 && mouseX <= position.x + size.width + anchorSize * 2 &&
      mouseY >= position.y - anchorSize * 2 && mouseY <= position.y + anchorSize * 2) {
      setIsResizing(true);
      setResizeAnchor('top-right');
      return;
    }
    if (mouseX >= position.x - anchorSize * 2 && mouseX <= position.x + anchorSize * 2 &&
      mouseY >= position.y + size.height - anchorSize * 2 && mouseY <= position.y + size.height + anchorSize * 2) {
      setIsResizing(true);
      setResizeAnchor('bottom-left');
      return;
    }
    if (mouseX >= position.x + size.width - anchorSize * 2 && mouseX <= position.x + size.width + anchorSize * 2 &&
      mouseY >= position.y + size.height - anchorSize * 2 && mouseY <= position.y + size.height + anchorSize * 2) {
      setIsResizing(true);
      setResizeAnchor('bottom-right');
      return;
    }


    // Check if mouse is inside the bounding box for dragging
    if (mouseX >= position.x && mouseX <= position.x + size.width &&
      mouseY >= position.y && mouseY <= position.y + size.height) {
      setIsDragging(true);
      setDragOffset({ x: mouseX - position.x, y: mouseY - position.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeAnchor(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isDragging) {
      setPosition({ x: mouseX - dragOffset.x, y: mouseY - dragOffset.y });
    }

    if (isResizing && resizeAnchor) {
      const anchorSize = 5;
      switch (resizeAnchor) {
        case 'top-left':
          setSize({ width: size.width + (position.x - mouseX), height: size.height + (position.y - mouseY) });
          setPosition({ x: mouseX, y: mouseY });
          break;
        case 'top-right':
          setSize({ width: mouseX - position.x, height: size.height + (position.y - mouseY) });
          setPosition({ x: position.x, y: mouseY });
          break;
        case 'bottom-left':
          setSize({ width: size.width + (position.x - mouseX), height: mouseY - position.y });
          setPosition({ x: mouseX, y: position.y });
          break;
        case 'bottom-right':
          setSize({ width: mouseX - position.x, height: mouseY - position.y });
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-md p-4">
      <h2 className="text-xl font-semibold mb-2">Text Canvas</h2>
      <canvas
        ref={canvasRef}
        width={600}  // Set a fixed width
        height={300} // Set a fixed height
        style={{ border: '1px solid black', cursor: isDragging ? 'grabbing' : 'default' }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};
