"use client";

import React, {useState, useRef, useEffect} from 'react';
import * as fabric from 'fabric';

interface TextCanvasProps {
  selectedFont: string | null;
  text: string;
  onTextChange: (newText: string) => void;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  kerning: number;
}

export const TextCanvas: React.FC<TextCanvasProps> = ({selectedFont, text, onTextChange, bold, italic, underline, kerning}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);

  useEffect(() => {
    const initializeCanvas = () => {
      const canvasElement = canvasRef.current;
      if (!canvasElement) return;

      const fabricCanvas = new fabric.Canvas(canvasElement, {
        width: 600,
        height: 300,
        backgroundColor: 'white',
        selection: true, // Enable object selection
        allowTouchScrolling: true
      });

      setCanvas(fabricCanvas);

      // Event listeners for object manipulation
      fabricCanvas.on('object:modified', (options) => {
        setActiveObject(options.target);
      });
      fabricCanvas.on('selection:created', (options) => {
        setActiveObject(options.target);
      });
      fabricCanvas.on('selection:updated', (options) => {
        setActiveObject(options.target);
      });
      fabricCanvas.on('selection:cleared', () => {
        setActiveObject(null);
      });

      // Double click for text editing
      fabricCanvas.on('mouse:dblclick', (e) => {
        if (e.target && e.target.type === 'i-text') {
          e.target.enterEditing();
        }
      });

      // Add initial text object
      const textObject = new fabric.IText(text, {
        left: 50,
        top: 50,
        fontFamily: selectedFont || 'Arial',
        fontWeight: bold ? 'bold' : 'normal',
        fontStyle: italic ? 'italic' : 'normal',
        textDecoration: underline ? 'underline' : '',
        charSpacing: kerning, // Kerning
        fontSize: 30,
      });
      fabricCanvas.add(textObject);
      fabricCanvas.setActiveObject(textObject);

      return () => {
        fabricCanvas.dispose();
      };
    };

    const cleanup = initializeCanvas();

    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, []);

  useEffect(() => {
    if (canvas && activeObject && activeObject.type === 'i-text') {
      (activeObject as fabric.IText).set({
        fontFamily: selectedFont || 'Arial',
        fontWeight: bold ? 'bold' : 'normal',
        fontStyle: italic ? 'italic' : 'normal',
        textDecoration: underline ? 'underline' : '',
        charSpacing: kerning, // Kerning
      });
      canvas.requestRenderAll();
    }
  }, [selectedFont, bold, italic, underline, kerning, canvas, activeObject]);

  useEffect(() => {
    if (canvas && activeObject && activeObject.type === 'i-text') {
      activeObject.set('text', text);
      canvas.requestRenderAll();
    }
  }, [text, canvas, activeObject]);

    useEffect(() => {
        if (canvas) {
            canvas.setWidth(canvasRef.current?.clientWidth || 600);
            canvas.setHeight(canvasRef.current?.clientHeight || 300);
            canvas.requestRenderAll();
        }
    }, [canvas]);

  return (
    <div className="flex flex-col h-full border rounded-md p-4 w-full">
      <h2 className="text-xl font-semibold mb-2">Text Canvas</h2>
      <canvas ref={canvasRef} width={600} height={300} style={{border: '1px solid black', flex: '1'}}/>
    </div>
  );
};
