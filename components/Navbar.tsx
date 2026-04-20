"use client";

import Image from "next/image";
import { memo } from "react";

import { navElements } from "@/constants";
import { ActiveElement, NavbarProps } from "@/types/type";

import { Button } from "./ui/button";
import ShapesMenu from "./ShapesMenu";

const Divider = () => (
  <li className="mx-2 w-px h-6 self-center bg-border/50" />
);

const Navbar = ({
  activeElement,
  imageInputRef,
  handleImageUpload,
  handleActiveElement,
  undo,
  redo,
}: NavbarProps) => {
  const isActive = (value: string | Array<ActiveElement>) =>
    (activeElement && activeElement.value === value) ||
    (Array.isArray(value) &&
      value.some((val) => val?.value === activeElement?.value));

  // Split navElements into logical groups
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
    <nav className="fixed top-0 left-0 right-0 z-50 flex select-none items-center justify-between gap-4 bg-background border-b px-5 py-2.5 text-foreground shadow-sm">
      <div className="flex items-center gap-2">
        <Image src="/assets/logo.svg" alt="FigPro Logo" width={32} height={32} className="object-contain" />
        <span className="font-bold text-sm tracking-tight text-foreground/90 max-sm:hidden">FIGPRO</span>
      </div>

      <ul className="flex flex-row items-center gap-1.5 bg-muted/50 rounded-xl p-1 border border-border/10">
        {/* Group 1: Selection & drawing tools */}
        {drawingTools.map(renderItem)}

        <Divider />

        {/* Group 2: History */}
        <li
          onClick={undo}
          title="Undo (Ctrl+Z)"
          className="group px-3 py-2 flex justify-center items-center hover:bg-muted rounded-lg cursor-pointer transition-all"
        >
          <div className="relative w-5 h-5 object-contain">
            <Image src="/assets/undo.svg" alt="Undo" fill className="invert opacity-80 group-hover:opacity-100 transition-opacity" />
          </div>
        </li>
        <li
          onClick={redo}
          title="Redo (Ctrl+Y)"
          className="group px-3 py-2 flex justify-center items-center hover:bg-muted rounded-lg cursor-pointer transition-all"
        >
          <div className="relative w-5 h-5 object-contain">
            <Image src="/assets/redo.svg" alt="Redo" fill className="invert opacity-80 group-hover:opacity-100 transition-opacity" />
          </div>
        </li>

        <Divider />

        {/* Group 3: Canvas actions */}
        {actionTools.map(renderItem)}
      </ul>

      <div className="flex items-center gap-4">
        {/* We can add profile or share buttons here if needed */}
        <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary">
          JD
        </div>
      </div>
    </nav>
  );
};

export default memo(
  Navbar,
  (prevProps, nextProps) => prevProps.activeElement === nextProps.activeElement
);
