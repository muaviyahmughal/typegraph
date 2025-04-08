export class CanvasManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dpr: number;
  private width: number;
  private height: number;
  private scale: number = 1;
  private offset = { x: 0, y: 0 };
  private rotation: number = 0;
  private isEditing: boolean = false;
  private selectedText: { text: string; x: number; y: number; style: TextStyle } | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not get canvas context");
    this.ctx = context;

    // Setup high DPI canvas
    this.dpr = window.devicePixelRatio || 1;
    this.width = canvas.width;
    this.height = canvas.height;

    this.setupCanvas();
    this.clear();

    // Add event listeners
    this.canvas.addEventListener("dblclick", this.handleDoubleClick.bind(this));
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
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
  }

  public clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  public drawGrid(cellSize: number = 20) {
    this.ctx.save();
    this.ctx.strokeStyle = "#ddd";
    this.ctx.lineWidth = 0.5;

    // Draw vertical lines
    for (let x = 0; x <= this.width; x += cellSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= this.height; y += cellSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  public drawText(text: string, x: number, y: number, style: TextStyle) {
    this.ctx.save();

    // Apply transformations
    this.ctx.translate(x + this.offset.x, y + this.offset.y);
    this.ctx.scale(this.scale, this.scale);
    this.ctx.rotate(this.rotation);

    // Apply text styles
    this.ctx.font = `${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`;
    this.ctx.fillStyle = style.color || "black";

    // Apply additional text features
    if (style.italic) this.ctx.font = `italic ${this.ctx.font}`;
    if (style.letterSpacing) {
      // Implement custom letter spacing
      const chars = text.split("");
      let currentX = 0;

      chars.forEach((char) => {
        this.ctx.fillText(char, currentX, 0);
        const metrics = this.ctx.measureText(char);
        currentX += metrics.width + (style.letterSpacing || 0);
      });
    } else {
      // Regular text drawing
      this.ctx.fillText(text, 0, 0);
    }

    // Draw underline if needed
    if (style.underline) {
      const metrics = this.ctx.measureText(text);
      const lineY = 3; // Adjust based on font metrics
      this.ctx.beginPath();
      this.ctx.moveTo(0, lineY);
      this.ctx.lineTo(metrics.width, lineY);
      this.ctx.strokeStyle = style.color || "black";
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }

    this.ctx.restore();

    // Draw bounding box if selected
    if (this.selectedText && this.selectedText.text === text) {
      this.drawBoundingBox(x, y, style, text);
    }
  }

  private drawBoundingBox(x: number, y: number, style: TextStyle, text: string) {
    this.ctx.save();

    const metrics = this.ctx.measureText(text);
    const width = metrics.width;
    const height = style.fontSize;

    this.ctx.strokeStyle = "blue";
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x, y - height, width, height);

    this.ctx.restore();
  }

  private handleDoubleClick(event: MouseEvent) {
    const { offsetX, offsetY } = event;

    if (this.selectedText) {
      const { x, y, style, text } = this.selectedText;
      const metrics = this.ctx.measureText(text);
      const width = metrics.width;
      const height = style.fontSize;

      if (
        offsetX >= x &&
        offsetX <= x + width &&
        offsetY >= y - height &&
        offsetY <= y
      ) {
        this.isEditing = true;
        const input = document.createElement("input");
        input.type = "text";
        input.value = text;
        input.style.position = "absolute";
        input.style.left = `${x}px`;
        input.style.top = `${y - height}px`;
        input.style.font = `${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`;
        document.body.appendChild(input);

        input.focus();

        input.addEventListener("blur", () => {
          this.selectedText!.text = input.value;
          this.isEditing = false;
          document.body.removeChild(input);
          this.clear();
          this.drawText(
            this.selectedText!.text,
            this.selectedText!.x,
            this.selectedText!.y,
            this.selectedText!.style
          );
        });
      }
    }
  }

  private handleMouseDown(event: MouseEvent) {
    // Placeholder for drag start logic
  }

  private handleMouseMove(event: MouseEvent) {
    // Placeholder for drag logic
  }

  private handleMouseUp(event: MouseEvent) {
    // Placeholder for drag end logic
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.setupCanvas();
  }

  public setTransform(scale: number, rotation: number, offset: { x: number; y: number }) {
    this.scale = scale;
    this.rotation = rotation;
    this.offset = offset;
  }
}

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
