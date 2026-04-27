"use client";

import Image from "next/image";
import { memo, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";

import { navElements } from "@/constants";
import { ActiveElement, NavbarProps } from "@/types/type";
import ShapesMenu from "./ShapesMenu";

const TOOLBAR_WIDTH = 420;

const Divider = () => (
  <li className="mx-2 w-px h-6 self-center bg-border/50" />
);

const FloatingToolbar = ({
  activeElement,
  imageInputRef,
  handleImageUpload,
  handleActiveElement,
  undo,
  redo,
}: NavbarProps) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 20 });
  const [mounted, setMounted] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPosition({
      x: Math.max(0, window.innerWidth / 2 - TOOLBAR_WIDTH / 2),
      y: 20,
    });
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isActive = (value: string | Array<ActiveElement>) =>
    (activeElement && activeElement.value === value) ||
    (Array.isArray(value) &&
      value.some((val) => val?.value === activeElement?.value));

  const drawingTools = navElements.slice(0, 4);
  const actionTools = navElements.slice(4);

  const renderItem = (item: ActiveElement | any) => (
    <li
      key={item.name}
      onClick={() => {
        if (Array.isArray(item.value)) return;
        handleActiveElement(item);
      }}
      className={`group px-3 py-2 flex justify-center items-center rounded-lg transition-all cursor-pointer
        ${isActive(item.value) ? "bg-primary shadow-lg shadow-primary/25" : "hover:bg-accent"}`}
    >
      {Array.isArray(item.value) ? (
        <ShapesMenu
          item={item}
          activeElement={activeElement}
          imageInputRef={imageInputRef}
          handleActiveElement={handleActiveElement}
          handleImageUpload={handleImageUpload}
        />
      ) : (
        <div className="relative w-5 h-5 object-contain">
          <Image
            src={item.icon}
            alt={item.name}
            fill
            className={isActive(item.value) ? "" : "invert opacity-80 group-hover:opacity-100 transition-opacity"}
          />
        </div>
      )}
    </li>
  );

  return (
    <Draggable
      nodeRef={nodeRef as React.RefObject<HTMLElement>}
      handle=".toolbar-drag-handle"
      defaultPosition={position}
      bounds="body"
    >
      <div ref={nodeRef} className="fixed z-100 select-none" style={{ top: 0, left: 0 }}>
        <nav className="flex items-center gap-1 bg-background border border-border/40 rounded-xl shadow-xl px-2 py-1.5">
          <div
            className="toolbar-drag-handle flex items-center px-1.5 py-2 cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            title="Drag to move"
          >
            <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor" aria-hidden="true">
              <circle cx="2" cy="2"  r="1.5" />
              <circle cx="8" cy="2"  r="1.5" />
              <circle cx="2" cy="8"  r="1.5" />
              <circle cx="8" cy="8"  r="1.5" />
              <circle cx="2" cy="14" r="1.5" />
              <circle cx="8" cy="14" r="1.5" />
            </svg>
          </div>

          <div className="w-px h-6 bg-border/50 mx-1" />

          <ul className="flex flex-row items-center gap-0.5">
            {drawingTools.map(renderItem)}

            <Divider />

            <li
              onClick={undo}
              title="Undo (Ctrl+Z)"
              className="group px-3 py-2 flex justify-center items-center hover:bg-accent rounded-lg cursor-pointer transition-all"
            >
              <div className="relative w-5 h-5 object-contain">
                <Image src="/assets/undo.svg" alt="Undo" fill className="invert opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            </li>
            <li
              onClick={redo}
              title="Redo (Ctrl+Y)"
              className="group px-3 py-2 flex justify-center items-center hover:bg-accent rounded-lg cursor-pointer transition-all"
            >
              <div className="relative w-5 h-5 object-contain">
                <Image src="/assets/redo.svg" alt="Redo" fill className="invert opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            </li>

            <Divider />

            {actionTools.map(renderItem)}
          </ul>
        </nav>
      </div>
    </Draggable>
  );
};

export default memo(
  FloatingToolbar,
  (prevProps, nextProps) => prevProps.activeElement === nextProps.activeElement
);
