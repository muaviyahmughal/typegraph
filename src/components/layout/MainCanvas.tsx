"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CanvasManager } from "@/lib/CanvasManager";
import { useTypography } from "@/contexts/TypographyContext";

export function MainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const managerRef = useRef<CanvasManager | null>(null);
  const { text, style } = useTypography();
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Initialize canvas manager
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    managerRef.current = new CanvasManager(canvas);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setCanvasSize({ width, height });
        managerRef.current?.resize(width, height);
        renderCanvas();
      }
    });

    resizeObserver.observe(canvas.parentElement || canvas);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Re-render when text or style changes
  useEffect(() => {
    renderCanvas();
  }, [text, style]);

  const renderCanvas = () => {
    if (!managerRef.current) return;

    const manager = managerRef.current;
    manager.clear();

    // Draw grid
    manager.drawGrid();

    // Calculate text position (center)
    const x = canvasSize.width / 2;
    const y = canvasSize.height / 2;

    // Draw text
    manager.drawText(text, x, y, {
      ...style,
      color: "var(--foreground)",
    });
  };

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

        {/* Position Indicators */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Canvas Size</span>
              <span>
                {canvasSize.width} × {canvasSize.height}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Scale</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
