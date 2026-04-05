import { HTTP_BACKEND } from "@/config";
import axios from "axios";
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

export async function initDraw(
  canvas: HTMLCanvasElement,
  shape: string,
  roomId: string,
  socket: WebSocket,
) {
  const ctx = canvas.getContext("2d");

  const existingShapes: Shape[] = await getExistingShapes(roomId);

  if (!ctx) return;

  if (!socket.onmessage) {
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "chat") {
        const parsedShape = JSON.parse(message.message);
        existingShapes.push(parsedShape);
        clearCanvas(existingShapes, canvas, ctx);
      }
    };
  }

  let clicked = false;
  let startX = 0;
  let startY = 0;

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  });
  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;

    let existShape: Shape;

    if (shape === "rect") {
      existShape = { type: "rect", x: startX, y: startY, width, height };
    } else {
      const radius = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
      existShape = {
        type: "circle",
        centerX: startX,
        centerY: startY,
        radius,
      };
    }

    existingShapes.push(existShape);
    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify(existShape),
        roomId,
      }),
    );
  });
  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;

      clearCanvas(existingShapes, canvas, ctx);

      if (shape === "rect") {
        ctx.fillRect(startX, startY, width, height);
      } else {
        const radius = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
        ctx.beginPath();
        ctx.strokeStyle = "rgb(255, 255, 255)";
        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
      }
    }
  });
}

function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgb(255, 255, 255)";

  existingShapes.forEach((shape) => {
    if (shape.type === "rect") {
      const { x, y, width, height } = shape;
      ctx.fillRect(x, y, width, height);
    } else {
      const { centerX, centerY, radius } = shape;

      ctx.beginPath();
      ctx.strokeStyle = "rgb(255, 255, 255)";
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    }
  });
}

async function getExistingShapes(roomId: string) {
  const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
  const messages = res.data.messages;

  //   @ts-ignore
  return messages.map((x) => {
    const messageData = JSON.parse(x.message);
    return messageData;
  });
}
