export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  color?: string;
  italic?: boolean;
  underline?: boolean;
  letterSpacing?: number;
  lineHeight?: number;
}

interface TextElement {
  text: string;
  x: number;
  y: number;
  style: TextStyle;
}

export class CanvasManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dpr: number;
  private width: number;
  private height: number;
  private isEditing: boolean = false;
  private editingText: string = "";
  private cursorVisible: boolean = false;
  private cursorInterval: number | null = null;
  private currentStyle: TextStyle | null = null;
  private onTextChange?: (text: string) => void;
  
  private getLineHeight(style: TextStyle, textHeight: number): number {
    return style.lineHeight ? style.lineHeight : textHeight * 1.2;
  }

  private wrapText(text: string, maxWidth: number): { lines: string[], lineBreaks: number[] } {
    // Split text into paragraphs by line breaks
    const paragraphs = text.split('\n');
    const lines: string[] = [];
    const lineBreaks: number[] = [];
    let charCount = 0;

    paragraphs.forEach((paragraph, pIndex) => {
      // Track line break positions
      if (pIndex > 0) {
        lineBreaks.push(charCount);
      }
      charCount += (pIndex > 0 ? 1 : 0); // Account for \n character

      if (paragraph === '') {
        lines.push('');
        charCount++;
        return;
      }

      const words = paragraph.split(' ');
      
      // Handle single word case
      if (words.length === 0) {
        lines.push('');
        charCount++;
        return;
      }

      // Check if single word is too long
      if (words.length === 1) {
        const width = this.ctx.measureText(words[0]).width;
        if (width > maxWidth) {
          // Break the word into characters
          const chars = words[0].split('');
          let currentLine = chars[0];
          
          for (let i = 1; i < chars.length; i++) {
            const width = this.ctx.measureText(currentLine + chars[i]).width;
            if (width < maxWidth) {
              currentLine += chars[i];
            } else {
              lines.push(currentLine);
              currentLine = chars[i];
            }
          }
          lines.push(currentLine);
          charCount += words[0].length;
          return;
        }
        lines.push(words[0]);
        charCount += words[0].length;
        return;
      }

      // Handle multiple words
      let currentLine = words[0];
      charCount += words[0].length;

      for (let i = 1; i < words.length; i++) {
        const width = this.ctx.measureText(currentLine + ' ' + words[i]).width;
        if (width < maxWidth) {
          currentLine += ' ' + words[i];
          charCount += words[i].length + 1; // +1 for space
        } else {
          lines.push(currentLine);
          currentLine = words[i];
          charCount += words[i].length;
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }
    });

    return { lines, lineBreaks };
  }
  
  public isInEditMode(): boolean {
    return this.isEditing;
  }

  constructor(canvas: HTMLCanvasElement, onTextChange?: (text: string) => void) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not get canvas context");
    this.ctx = context;

    // Setup high DPI canvas
    this.dpr = window.devicePixelRatio || 1;
    this.width = canvas.width;
    this.height = canvas.height;

    this.onTextChange = onTextChange;
    this.setupCanvas();
    this.addEventListeners();
    this.clear();
  }

  private setupCanvas() {
    // Set display size
    this.canvas.style.width = this.width + "px";
    this.canvas.style.height = this.height + "px";

    // Set actual size in memory
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;

    // Scale context to ensure correct drawing operations
    this.ctx.scale(this.dpr, this.dpr);

    // Enable text anti-aliasing
    this.ctx.textRendering = "optimizeLegibility";
    this.ctx.imageSmoothingEnabled = true;

    // Make canvas focusable
    this.canvas.tabIndex = 1;
    this.canvas.style.outline = "none";
    this.canvas.style.cursor = "text";
  }

  private addEventListeners() {
    this.canvas.addEventListener("click", this.handleClick.bind(this));
    this.canvas.addEventListener("keydown", this.handleKeyDown.bind(this));
    this.canvas.addEventListener("keypress", this.handleKeyPress.bind(this));
    this.canvas.addEventListener("blur", () => {
      if (this.isEditing) {
        this.isEditing = false;
        this.stopCursorBlink();
        this.redrawCanvas();
      }
    });
  }

  private startCursorBlink() {
    if (this.cursorInterval) {
      clearInterval(this.cursorInterval);
    }
    this.cursorVisible = true;
    this.cursorInterval = window.setInterval(() => {
      this.cursorVisible = !this.cursorVisible;
      this.redrawCanvas();
    }, 530) as unknown as number;
  }

  private stopCursorBlink() {
    if (this.cursorInterval) {
      clearInterval(this.cursorInterval);
      this.cursorInterval = null;
    }
    this.cursorVisible = false;
  }

  private redrawCanvas() {
    this.clear();
    this.drawGrid();
    
    if (this.currentStyle) {
      const text = this.isEditing ? this.editingText : (this.canvas.getAttribute("data-text") || "Type something...");
      
      // Draw the current text
      this.ctx.save();
      this.ctx.font = `${this.currentStyle.fontWeight} ${this.currentStyle.fontSize}px ${this.currentStyle.fontFamily}`;
      this.ctx.fillStyle = this.currentStyle.color || "black";
      if (this.currentStyle.italic) this.ctx.font = `italic ${this.ctx.font}`;

      const maxWidth = this.width * 0.8;
      const { lines, lineBreaks } = this.wrapText(text, maxWidth);
      const metrics = this.ctx.measureText('M');
      const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      const lineHeight = this.getLineHeight(this.currentStyle, textHeight);
      const totalHeight = lines.length * lineHeight;
      
      const startY = this.height / 2 - totalHeight / 2;
      
      // Track cursor position for editing
      let cursorLine = 0;
      let cursorX = 0;
      
      // Draw each line
      lines.forEach((line, index) => {
        const y = startY + (index * lineHeight) + textHeight;
        const lineMetrics = this.ctx.measureText(line);
        let lineWidth = lineMetrics.width;
        const x = this.width / 2;

        // Calculate cursor position if we're in edit mode
        if (this.isEditing) {
          // Find where the cursor should be based on lineBreaks
          const currentPosition = this.editingText.length;
          const isBreakBeforeCursor = lineBreaks.some((breakPos) => breakPos === currentPosition - 1);
          
          if (isBreakBeforeCursor && index === lines.length - 1) {
            cursorLine = index;
            cursorX = this.width / 2 - lineWidth / 2;
          } else if (index === lines.length - 1) {
            cursorLine = index;
            let lastLineContent = line;
            const cursorOffset = this.ctx.measureText(lastLineContent).width;
            cursorX = this.width / 2 - lineWidth / 2 + cursorOffset;
          }
        }

        // Draw text with letter spacing if needed
        if (this.currentStyle?.letterSpacing) {
          lineWidth += this.currentStyle.letterSpacing * (line.length - 1);
          let currentX = x - lineWidth / 2;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const charWidth = this.ctx.measureText(char).width;
            this.ctx.fillText(char, currentX, y);
            currentX += charWidth + this.currentStyle.letterSpacing;
          }
        } else {
          this.ctx.fillText(line, x - lineWidth / 2, y);
        }

        // Draw underline if needed
        if (this.currentStyle?.underline) {
          const lineY = y + 3;
          this.ctx.beginPath();
          this.ctx.moveTo(x - lineWidth / 2, lineY);
          this.ctx.lineTo(x + lineWidth / 2, lineY);
          this.ctx.strokeStyle = this.currentStyle.color || "black";
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      });

      // Draw cursor when editing
      if (this.isEditing && this.cursorVisible) {
        const cursorY = startY + (cursorLine * lineHeight) + textHeight;

        this.ctx.beginPath();
        this.ctx.moveTo(cursorX, cursorY - textHeight);
        this.ctx.lineTo(cursorX, cursorY);
        this.ctx.strokeStyle = this.currentStyle.color || "black";
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }
      
      this.ctx.restore();
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.isEditing) return;

    if (event.key === "Escape") {
      this.isEditing = false;
      this.stopCursorBlink();
      this.redrawCanvas();
    } else if (event.key === "Backspace") {
      event.preventDefault();
      this.editingText = this.editingText.slice(0, -1);
      if (this.onTextChange) {
        this.onTextChange(this.editingText);
      }
      this.redrawCanvas();
    } else if (event.key === "Enter") {
      event.preventDefault();
      const currentPosition = this.editingText.length;
      this.editingText = this.editingText.slice(0, currentPosition) + "\n" + this.editingText.slice(currentPosition);
      if (this.onTextChange) {
        this.onTextChange(this.editingText);
      }
      this.redrawCanvas();
    }
  }

  private handleKeyPress(event: KeyboardEvent) {
    if (!this.isEditing) return;
    
    if (event.key.length === 1) {
      event.preventDefault();
      this.editingText += event.key;
      if (this.onTextChange) {
        this.onTextChange(this.editingText);
      }
      this.redrawCanvas();
    }
  }

  private handleClick(event: MouseEvent) {
    // If already editing, clicking anywhere stops editing
    if (this.isEditing) {
      this.isEditing = false;
      this.stopCursorBlink();
      this.redrawCanvas();
      return;
    }
    
    // Get click coordinates and check if near text center
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX / this.dpr;
    const y = (event.clientY - rect.top) * scaleY / this.dpr;
    
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    
    const distance = Math.sqrt(
      Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
    );
    
    // Only allow editing if click is near the text center
    if (distance <= 100) {
      this.isEditing = true;
      this.editingText = this.canvas.getAttribute("data-text") || "Type something...";
      this.startCursorBlink();
      this.redrawCanvas();
      this.canvas.focus();
    }
  }

  public clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  public drawGrid(cellSize: number = 20) {
    this.ctx.save();
    this.ctx.strokeStyle = "#ddd";
    this.ctx.lineWidth = 0.5;

    for (let x = 0; x <= this.width; x += cellSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }

    for (let y = 0; y <= this.height; y += cellSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  public drawText(text: string, x: number, y: number, style: TextStyle) {
    // Store current text and style
    this.canvas.setAttribute("data-text", text);
    this.currentStyle = style;
    
    this.ctx.save();
    
    // Apply text styles
    this.ctx.font = `${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`;
    this.ctx.fillStyle = style.color || "black";
    if (style.italic) this.ctx.font = `italic ${this.ctx.font}`;
    
    const maxWidth = this.width * 0.8; // Use 80% of canvas width
    const { lines } = this.wrapText(text, maxWidth);
    const metrics = this.ctx.measureText('M');
    const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    const lineHeight = this.getLineHeight(style, textHeight);
    const totalHeight = lines.length * lineHeight;
    
    const startY = y - totalHeight / 2;
    
    lines.forEach((line: string, index: number) => {
      const lineY = startY + (index * lineHeight) + textHeight;
      const lineMetrics = this.ctx.measureText(line);
      let lineWidth = lineMetrics.width;
      
      // Adjust width and draw text with letter spacing if needed
      if (style.letterSpacing) {
        lineWidth += style.letterSpacing * (line.length - 1);
        let currentX = x - lineWidth / 2;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          const charWidth = this.ctx.measureText(char).width;
          this.ctx.fillText(char, currentX, lineY);
          currentX += charWidth + style.letterSpacing;
        }
      } else {
        this.ctx.fillText(line, x - lineWidth / 2, lineY);
      }
      
      // Draw underline if needed
      if (style.underline) {
        const underlineY = lineY + 3;
        this.ctx.beginPath();
        this.ctx.moveTo(x - lineWidth / 2, underlineY);
        this.ctx.lineTo(x + lineWidth / 2, underlineY);
        this.ctx.strokeStyle = style.color || "black";
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      }
    });
    
    this.ctx.restore();
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.setupCanvas();
    this.clear();
    this.drawGrid();
  }
}
