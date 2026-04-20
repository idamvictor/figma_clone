import React, { useMemo, useRef } from "react";

import { RightSidebarProps } from "@/types/type";
import { modifyShape } from "@/lib/shapes";

import Text from "./settings/Text";
import Color from "./settings/Color";
import Export from "./settings/Export";
import Dimensions from "./settings/Dimensions";

function getEnabledSections(type: string | null) {
  if (type === null)       return { dimensions: false, fill: true,  stroke: false, opacity: false, text: false };
  if (type === "text")     return { dimensions: true,  fill: true,  stroke: true,  opacity: true,  text: true  };
  if (type === "line")     return { dimensions: true,  fill: false, stroke: true,  opacity: true,  text: false };
  if (type === "image")    return { dimensions: true,  fill: false, stroke: false, opacity: true,  text: false };
  if (type === "multiple") return { dimensions: false, fill: false, stroke: false, opacity: false, text: false };
  return                          { dimensions: true,  fill: true,  stroke: true,  opacity: true,  text: false }; // shape
}

const RightSidebar = ({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  activeObjectRef,
  isEditingRef,
  syncShapeInStorage,
  selectedElementType,
  onCanvasColorChange,
}: RightSidebarProps) => {
  const colorInputRef = useRef(null);
  const strokeInputRef = useRef(null);

  const memoizedContent = useMemo(() => {
    const enabled = getEnabledSections(selectedElementType);
    const isCanvas = selectedElementType === null;

    const handleInputChange = (property: string, value: string) => {
      if (!isEditingRef.current) isEditingRef.current = true;
      setElementAttributes((prev) => ({ ...prev, [property]: value }));
      if (!activeObjectRef.current) {
        if (property === "fill") onCanvasColorChange(value);
        return;
      }
      modifyShape({
        canvas: fabricRef.current as fabric.Canvas,
        property,
        value,
        activeObjectRef,
        syncShapeInStorage,
      });
    };

    return (
      <section className="flex flex-col border-l bg-background text-muted-foreground w-64 pt-5 h-full max-sm:hidden select-none overflow-y-auto transition-all">
        <div className="flex flex-col gap-0.5 px-5 py-4 border-b border-border mb-2">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Design</h3>
          <p className="text-[11px] text-muted-foreground leading-tight">
            {isCanvas ? "Canvas background color" : "Adjust object properties below"}
          </p>
        </div>

        <div className="flex flex-col">
          <Dimensions
            isEditingRef={isEditingRef}
            width={elementAttributes.width}
            height={elementAttributes.height}
            handleInputChange={handleInputChange}
            disabled={!enabled.dimensions}
          />

          <Text
            fontFamily={elementAttributes.fontFamily}
            fontSize={elementAttributes.fontSize}
            fontWeight={elementAttributes.fontWeight}
            handleInputChange={handleInputChange}
            disabled={!enabled.text}
          />

          <Color
            inputRef={colorInputRef}
            attribute={elementAttributes.fill}
            placeholder="color"
            attributeType="fill"
            handleInputChange={handleInputChange}
            opacity={enabled.opacity ? elementAttributes.opacity : undefined}
            disabled={!enabled.fill}
          />

          <Color
            inputRef={strokeInputRef}
            attribute={elementAttributes.stroke}
            placeholder="stroke"
            attributeType="stroke"
            handleInputChange={handleInputChange}
            disabled={!enabled.stroke}
          />

          <div className="px-5 py-6 mt-auto border-t border-border">
            <Export canvas={fabricRef.current} />
          </div>
        </div>
      </section>
    );
  }, [elementAttributes, selectedElementType, onCanvasColorChange, syncShapeInStorage, activeObjectRef, fabricRef, isEditingRef, setElementAttributes]);

  return memoizedContent;
};

export default RightSidebar;
