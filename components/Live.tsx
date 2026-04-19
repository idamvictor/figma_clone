"use client";

import { useCallback } from "react";

import { shortcuts } from "@/constants";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";

type Props = {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  undo: () => void;
  redo: () => void;
};

const Live = ({ canvasRef, undo, redo }: Props) => {
  const handleContextMenuClick = useCallback(
    (key: string) => {
      switch (key) {
        case "Undo":
          undo();
          break;
        case "Redo":
          redo();
          break;
        default:
          break;
      }
    },
    [undo, redo]
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger
        className="relative flex h-full w-full flex-1 items-center justify-center bg-zinc-50"
        id="canvas"
        style={{
          backgroundImage: 'radial-gradient(circle, #e4e4e7 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      >
        <canvas ref={canvasRef} className="shadow-lg border border-border/50" />
      </ContextMenuTrigger>

      <ContextMenuContent className="right-menu-content border border-border rounded-lg overflow-hidden shadow-lg bg-background">
        <div className="px-3 pt-2 pb-1 border-b border-border mb-1">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Actions</span>
        </div>
        {shortcuts.map((item) => (
          <ContextMenuItem
            key={item.key}
            className="right-menu-item mx-1 rounded-md transition-all active:scale-95"
            onClick={() => handleContextMenuClick(item.name)}
          >
            <p className="text-sm font-medium">{item.name}</p>
            <p className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded border border-border text-muted-foreground">{item.shortcut}</p>
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default Live;
