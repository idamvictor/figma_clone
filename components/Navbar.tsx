"use client";

import Image from "next/image";
import { memo } from "react";

import { navElements } from "@/constants";
import { ActiveElement, NavbarProps } from "@/types/type";

import { Button } from "./ui/button";
import ShapesMenu from "./ShapesMenu";

const Divider = () => (
  <li className="mx-1 w-px self-stretch bg-primary-grey-200 opacity-50" />
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
  // Group 1: selection + drawing tools (Select, Shapes, Text, Image)
  const drawingTools = navElements.slice(0, 4);
  // Group 2: destructive actions (Delete, Reset)
  const actionTools = navElements.slice(4);

  const renderItem = (item: ActiveElement | any) => (
    <li
      key={item.name}
      onClick={() => {
        if (Array.isArray(item.value)) return;
        handleActiveElement(item);
      }}
      className={`group px-2.5 py-5 flex justify-center items-center
        ${isActive(item.value) ? "bg-primary-green" : "hover:bg-primary-grey-200"}`}
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
        <Button className="relative w-5 h-5 object-contain">
          <Image
            src={item.icon}
            alt={item.name}
            fill
            className={isActive(item.value) ? "invert" : ""}
          />
        </Button>
      )}
    </li>
  );

  return (
    <nav className="flex select-none items-center justify-between gap-4 bg-primary-black px-5 text-white">
      <Image src="/assets/logo.svg" alt="FigPro Logo" width={58} height={20} />

      <ul className="flex flex-row items-center">
        {/* Group 1: Selection & drawing tools */}
        {drawingTools.map(renderItem)}

        <Divider />

        {/* Group 2: History */}
        <li
          onClick={undo}
          title="Undo (Ctrl+Z)"
          className="group px-2.5 py-5 flex justify-center items-center hover:bg-primary-grey-200 cursor-pointer"
        >
          <Button className="relative w-5 h-5 object-contain">
            <Image src="/assets/undo.svg" alt="Undo" fill />
          </Button>
        </li>
        <li
          onClick={redo}
          title="Redo (Ctrl+Y)"
          className="group px-2.5 py-5 flex justify-center items-center hover:bg-primary-grey-200 cursor-pointer"
        >
          <Button className="relative w-5 h-5 object-contain">
            <Image src="/assets/redo.svg" alt="Redo" fill />
          </Button>
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
