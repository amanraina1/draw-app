"use client";
import { initDraw } from "@/draw";
import Toolbar from "@/miniComp/Toolbar";
import { useEffect, useRef, useState } from "react";

export default function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [shape, setShape] = useState<string>("rect");
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
      <Toolbar shape={shape} setShape={setShape} />
    </div>
  );
}
