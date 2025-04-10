"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CanvasManager } from "@/lib/CanvasManager";
import { useTypography } from "@/contexts/TypographyContext";

export function MainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const managerRef = useRef<CanvasManager | null>(null);
  const { text, style, setText } = useTypography();
  const [canvasSize, setCanvasSize] = useState({ 
    width: 800, 
    height: 600,
    dpr: 1
  });

  // Update DPR after mount
  useEffect(() => {
    setCanvasSize(prev => ({
      ...prev,
      dpr: window.devicePixelRatio
    }));
  }, []);

  // Initialize canvas manager and handle resize
  // Initialize canvas manager
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    managerRef.current = new CanvasManager(canvas, setText);

    // Initial size setup
    const parentRect = canvas.parentElement?.getBoundingClientRect();
    if (parentRect) {
      const dpr = window.devicePixelRatio;
      const width = parentRect.width;
      const height = parentRect.height;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      setCanvasSize({ width, height, dpr });
      managerRef.current.resize(width, height);
    }

    // Cleanup
    return () => {
      if (managerRef.current) {
        // Your cleanup code here if needed
      }
    };
  }, [setText]); // Only recreate when setText changes

  // Handle resize
  useEffect(() => {
    if (!canvasRef.current || !managerRef.current) return;

    const canvas = canvasRef.current;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const dpr = window.devicePixelRatio;
        setCanvasSize({ width, height, dpr });
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        managerRef.current?.resize(width, height);
      }
    });

    resizeObserver.observe(canvas.parentElement || canvas);
    return () => resizeObserver.disconnect();
  }, []);

  // Update data-text attribute when text changes
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.setAttribute('data-text', text || 'Type something...');
    }
  }, [text]);

  // Update canvas when text or style changes
  useEffect(() => {
    if (!managerRef.current) return;
    
    // Skip redraw if the canvas is currently being edited
    // This prevents interrupting the editing experience
    if (managerRef.current.isInEditMode()) return;
    
    managerRef.current.clear();
    managerRef.current.drawGrid();
    
    managerRef.current.drawText(
      text || "Type something...", 
      canvasSize.width / 2, 
      canvasSize.height / 2, 
      {
        ...style,
        color: "var(--foreground)",
        fontSize: style.fontSize || 24,
        fontFamily: style.fontFamily || "Inter"
      }
    );
  }, [text, style, canvasSize]);

  return (
    <motion.div 
      className="flex-1 bg-background p-8 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mx-auto max-w-4xl h-full">
        <motion.div
          className="h-full rounded-lg border bg-card shadow-sm relative overflow-hidden"
          whileHover={{ boxShadow: "0 0 0 1px var(--border)" }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{
              touchAction: "none",
            }}
          />
        </motion.div>

        {/* Canvas Information */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Canvas Size</span>
              <span>
                {Math.round(canvasSize.width)} × {Math.round(canvasSize.height)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>DPI Scale</span>
              <span>{canvasSize.dpr}x</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
