"use client";

import { WS_URL } from "@/config";
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import Canvas from "./Canvas";

export default function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyYjU4YWFmNS1kYWQwLTQ2OTEtOTBkOS1hZjVjNTE3MmE4YzciLCJpYXQiOjE3NzQ5ODM1NjR9.q3Tha1ENkIslklK2TUrlwn0vRb3Qps0BipHTui-JsEI`,
    );

    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        }),
      );
    };
  }, []);

  if (!socket) {
    return <div>Connecting to server .....</div>;
  }

  return <Canvas roomId={roomId} socket={socket} />;
}
