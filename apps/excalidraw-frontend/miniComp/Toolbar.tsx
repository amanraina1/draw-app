"use client";
import { Dispatch, SetStateAction } from "react";
import { RectangleHorizontalIcon, CircleIcon } from "lucide-react";
import { Tool } from "@/components/Canvas";

interface PropType {
  tool: string;
  setTool: Dispatch<SetStateAction<Tool>>;
}

export default function Toolbar({ tool, setTool }: PropType) {
  return (
    <div className="absolute top-5 w-full flex justify-center">
      <div
        className=" w-full flex justify-center py-1 rounded-xl bg-[#232329]"
        style={{ zIndex: 1, width: "50%" }}
      >
        <div className="flex gap-3">
          <button
            type="button"
            title="Rectangle"
            onClick={() => setTool("rect")}
            className={`${tool === "rect" ? "bg-[#403e6a]" : "hover:bg-[#2e2d39]"} rounded-xl text-white font-bold py-2.5 px-2.5 cursor-pointer`}
          >
            <RectangleHorizontalIcon className="size-5" strokeWidth={1} />
          </button>
          <button
            type="button"
            title="Circle"
            onClick={() => setTool("circle")}
            className={`${tool === "circle" ? "bg-[#403e6a]" : "hover:bg-[#2e2d39]"} rounded-xl text-white font-bold py-2.5 px-2.5 cursor-pointer`}
          >
            <CircleIcon className="size-5" strokeWidth={1} />
          </button>
        </div>
      </div>
    </div>
  );
}
