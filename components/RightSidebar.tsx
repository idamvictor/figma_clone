import React, { useMemo, useRef } from "react";

import { RightSidebarProps } from "@/types/type";
import { bringElement, modifyShape } from "@/lib/shapes";

import Text from "./settings/Text";
import Color from "./settings/Color";
import Export from "./settings/Export";
import Dimensions from "./settings/Dimensions";

const RightSidebar = ({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  activeObjectRef,
  isEditingRef,
  syncShapeInStorage,
}: RightSidebarProps) => {
  const colorInputRef = useRef(null);
  const strokeInputRef = useRef(null);

  const handleInputChange = (property: string, value: string) => {
    if (!isEditingRef.current) isEditingRef.current = true;

    setElementAttributes((prev) => ({ ...prev, [property]: value }));

    modifyShape({
      canvas: fabricRef.current as fabric.Canvas,
      property,
      value,
      activeObjectRef,
      syncShapeInStorage,
    });
  };
  
  // memoize the content of the right sidebar to avoid re-rendering on every mouse actions
  const memoizedContent = useMemo(
    () => (
      <section className="flex flex-col border-l bg-background text-muted-foreground w-64 pt-5 h-full max-sm:hidden select-none overflow-y-auto transition-all">
        <div className="flex flex-col gap-0.5 px-5 py-4 border-b border-border mb-2">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Design</h3>
          <p className="text-[11px] text-muted-foreground leading-tight">
            Adjust object properties below
          </p>
        </div>

        <div className="flex flex-col">
          <Dimensions
            isEditingRef={isEditingRef}
            width={elementAttributes.width}
            height={elementAttributes.height}
            handleInputChange={handleInputChange}
          />

          <Text
            fontFamily={elementAttributes.fontFamily}
            fontSize={elementAttributes.fontSize}
            fontWeight={elementAttributes.fontWeight}
            handleInputChange={handleInputChange}
          />

          <Color
            inputRef={colorInputRef}
            attribute={elementAttributes.fill}
            placeholder="color"
            attributeType="fill"
            handleInputChange={handleInputChange}
            opacity={elementAttributes.opacity}
          />

          <Color
            inputRef={strokeInputRef}
            attribute={elementAttributes.stroke}
            placeholder="stroke"
            attributeType="stroke"
            handleInputChange={handleInputChange}
          />

          <div className="px-5 py-6 mt-auto border-t border-border">
            <Export canvas={fabricRef.current} />
          </div>
        </div>
      </section>
    ),
    [elementAttributes]
  ); // only re-render when elementAttributes changes

  return memoizedContent;
};

export default RightSidebar;
