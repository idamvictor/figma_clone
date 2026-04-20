"use client";

import Image from "next/image";
import { memo } from "react";

import { navElements } from "@/constants";
import { ActiveElement, NavbarProps } from "@/types/type";

import { Button } from "./ui/button";
import ShapesMenu from "./ShapesMenu";

const Divider = () => (
  <li className="mx-1.5 w-px h-5 self-center bg-black/5" />
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
      className={`group p-2 flex justify-center items-center rounded-xl transition-all cursor-pointer relative
        ${isActive(item.value) 
          ? "bg-black/[0.08] text-black shadow-sm border border-black/10" 
          : "hover:bg-black/5 text-black/60 hover:text-black"}`}
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
        <div className="relative w-5 h-5 transition-transform group-hover:scale-110 group-active:scale-95">
          <Image
            src={item.icon}
            alt={item.name}
            fill
            className={isActive(item.value) ? "invert" : "invert opacity-70 group-hover:opacity-100 transition-opacity"}
          />
        </div>
      )}
      {isActive(item.value) && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-black/80 shadow-[0_0_8px_rgba(0,0,0,0.2)]" />
      )}
    </li>
  );

  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex select-none items-center justify-center gap-4 bg-white/80 backdrop-blur-xl border border-black/5 px-2 py-2 text-foreground shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-2xl transition-all duration-300 hover:border-black/10">
      <ul className="flex flex-row items-center gap-1">
        {/* Group 1: Selection & drawing tools */}
        {drawingTools.map(renderItem)}

        <Divider />

        {/* Group 2: History */}
        <li
          onClick={undo}
          title="Undo (Ctrl+Z)"
          className="group px-3 py-2 flex justify-center items-center hover:bg-black/5 rounded-lg cursor-pointer transition-all active:scale-90"
        >
          <div className="relative w-5 h-5 object-contain">
            <Image src="/assets/undo.svg" alt="Undo" fill className="invert opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>
        </li>
        <li
          onClick={redo}
          title="Redo (Ctrl+Y)"
          className="group px-3 py-2 flex justify-center items-center hover:bg-black/5 rounded-lg cursor-pointer transition-all active:scale-90"
        >
          <div className="relative w-5 h-5 object-contain">
            <Image src="/assets/redo.svg" alt="Redo" fill className="invert opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>
        </li>

        <Divider />

        {/* Group 3: Canvas actions */}
        {actionTools.map(renderItem)}
      </ul>
    </nav>
  );
};

export default memo(
  Navbar,
  (prevProps, nextProps) => prevProps.activeElement === nextProps.activeElement
);
