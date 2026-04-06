import type { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    };

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[] = [];
  private roomId: string;
  private socket: WebSocket;
  private clicked: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private selectedTool: Tool = "rect";

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;
    this.clicked = false;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  async init() {
    this.existingShapes = await getExistingShapes(this.roomId);
    this.clearCanvas();
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "chat") {
        const parsedShape = JSON.parse(message.message);
        this.existingShapes.push(parsedShape);
        this.clearCanvas();
      }
    };
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.existingShapes.forEach((shape) => {
      this.ctx.strokeStyle = "rgb(255, 255, 255)";
      if (shape.type === "rect") {
        const { x, y, width, height } = shape;
        this.ctx.strokeRect(x, y, width, height);
      } else {
        const { centerX, centerY, radius } = shape;

        this.ctx.beginPath();

        this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    });
  }

  handleMouseDown = (e: MouseEvent) => {
    this.clicked = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
  };
  handleMouseUp = (e: MouseEvent) => {
    this.clicked = false;
    const width = e.clientX - this.startX;
    const height = e.clientY - this.startY;

    let existShape: Shape;

    if (this.selectedTool === "rect") {
      existShape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        width,
        height,
      };
    } else {
      const radius = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
      existShape = {
        type: "circle",
        centerX: this.startX,
        centerY: this.startY,
        radius,
      };
    }

    this.existingShapes.push(existShape);
    this.socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify(existShape),
        roomId: this.roomId,
      }),
    );
  };
  handleMouseMove = (e: MouseEvent) => {
    if (this.clicked) {
      const width = e.clientX - this.startX;
      const height = e.clientY - this.startY;

      this.clearCanvas();

      if (this.selectedTool === "rect") {
        this.ctx.strokeStyle = "rgb(255, 255, 255)";
        this.ctx.strokeRect(this.startX, this.startY, width, height);
      } else {
        const radius = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
        this.ctx.beginPath();
        this.ctx.strokeStyle = "rgb(255, 255, 255)";
        this.ctx.arc(
          this.startX,
          this.startY,
          Math.abs(radius),
          0,
          Math.PI * 2,
        );
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
  };

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
  }

  destroyListeners() {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
  }
}
