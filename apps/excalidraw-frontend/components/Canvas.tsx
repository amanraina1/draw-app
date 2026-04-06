"use client";
import { Game } from "@/draw/Game";
import Toolbar from "@/miniComp/Toolbar";
import { useEffect, useRef, useState } from "react";

export type Tool = "circle" | "pencil" | "rect";

export default function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] = useState<Tool>("rect");

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const g = new Game(canvasRef.current, roomId, socket);
    setGame(g);

    return () => g.destroyListeners();
  }, []);

  return (
    <div>
      <canvas
        width={window.innerWidth}
        height={window.innerHeight}
        ref={canvasRef}
      ></canvas>
      <Toolbar tool={selectedTool} setTool={setSelectedTool} />
    </div>
  );
}
