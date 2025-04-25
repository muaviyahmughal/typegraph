'use client'

import React, {useState, useRef, useEffect, useCallback} from 'react';
import * as fabric from 'fabric';

interface TextCanvasProps {
  selectedFont: string | null;
  text: string;
  onTextChangeAction: (newText: string) => void;
  onCanvasInit?: (canvas: fabric.Canvas) => void;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  kerning: number;
}

export const TextCanvas: React.FC<TextCanvasProps> = ({selectedFont, text, onTextChangeAction, onCanvasInit, bold, italic, underline, kerning}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);

  useEffect(() => {
    const initializeCanvas = () => {
      const canvasElement = canvasRef.current;
      if (!canvasElement) return;

      const container = containerRef.current;
      if (!container) return;

      const fabricCanvas = new fabric.Canvas(canvasElement, {
        width: container.clientWidth - 32, // Accounting for padding
        height: container.clientHeight - 70, // Accounting for padding and header
        backgroundColor: 'white',
        selection: true,
        allowTouchScrolling: true
      });

      setCanvas(fabricCanvas);
      onCanvasInit?.(fabricCanvas);

      // Event listeners for object manipulation
      fabricCanvas.on('object:modified', (options) => {
        if ('target' in options) {
          setActiveObject(options.target as fabric.Object);
        }
      });
      fabricCanvas.on('selection:created', (options) => {
        const selected = options.selected?.[0];
        if (selected) {
          setActiveObject(selected);
        }
      });
      fabricCanvas.on('selection:updated', (options) => {
        const selected = options.selected?.[0];
        if (selected) {
          setActiveObject(selected);
        }
      });
      fabricCanvas.on('selection:cleared', () => {
        setActiveObject(null);
      });

      // Double click for text editing
      fabricCanvas.on('mouse:dblclick', (e) => {
        const target = e.target as fabric.IText;
        if (target && target.type === 'i-text') {
          target.enterEditing();
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

    const handleResize = useCallback(() => {
      if (canvas && containerRef.current) {
        const container = containerRef.current;
        canvas.setWidth(container.clientWidth - 32);
        canvas.setHeight(container.clientHeight - 70);
        canvas.requestRenderAll();
      }
    }, [canvas]);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        window.addEventListener('resize', handleResize);
        
        // Create ResizeObserver for container size changes
        const resizeObserver = new ResizeObserver(() => {
          handleResize();
        });

        if (containerRef.current) {
          resizeObserver.observe(containerRef.current);
        }

        return () => {
          window.removeEventListener('resize', handleResize);
          resizeObserver.disconnect();
        };
      }
    }, [handleResize]);

  return (
    <div ref={containerRef} className="flex flex-col h-full border rounded-md p-4 w-full">
      <h2 className="text-xl font-semibold mb-2">Text Canvas</h2>
      <div className="flex-1 relative">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{border: '1px solid black'}}/>
      </div>
    </div>
  );
};
