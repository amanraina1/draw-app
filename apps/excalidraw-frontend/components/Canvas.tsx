"use client";
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";

export default function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [shape, setShape] = useState<"rect" | "circle">("rect");
  useEffect(() => {
    if (canvasRef.current) {
      initDraw(canvasRef.current, shape, roomId, socket);
    }
  }, [shape]);

  return (
    <div>
      <canvas
        width={window.innerWidth}
        height={window.innerHeight}
        ref={canvasRef}
      ></canvas>
      <div className="absolute bottom-0 right-0 flex m-5 gap-3">
        <button
          type="button"
          onClick={() => setShape("rect")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          Rectangle
        </button>
        <button
          type="button"
          onClick={() => setShape("circle")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          Circle
        </button>
      </div>
    </div>
  );
}
