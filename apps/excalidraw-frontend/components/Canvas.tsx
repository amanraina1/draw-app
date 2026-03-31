"use client";

import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";

export default function Canvas({ roomId }: { roomId: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [shape, setShape] = useState<"rect" | "circle">("rect");

  useEffect(() => {
    console.log(roomId);
    if (canvasRef.current) {
      initDraw(canvasRef.current, shape, roomId);
    }
  }, [shape]);
  return (
    <div>
      <canvas ref={canvasRef}></canvas>
      <div className="absolute bottom-0 right-0 flex">
        <button
          type="button"
          onClick={() => setShape("rect")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 rounded cursor-pointer"
        >
          Rectangle
        </button>
        <button
          type="button"
          onClick={() => setShape("circle")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 rounded cursor-pointer"
        >
          Circle
        </button>
      </div>
    </div>
  );
}
