"use client";

import Image from "next/image";

import { ShapesMenuProps } from "@/types/type";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";

const ShapesMenu = ({
  item,
  activeElement,
  handleActiveElement,
  handleImageUpload,
  imageInputRef,
}: ShapesMenuProps) => {
  const isDropdownElem = item.value.some((elem) => elem?.value === activeElement.value);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="no-ring">
          <div className="relative h-5 w-5 object-contain cursor-pointer transition-all hover:scale-110 active:scale-95">
            <Image
              src={isDropdownElem ? activeElement.icon : item.icon}
              alt={item.name}
              fill
              className={isDropdownElem ? "invert" : "invert opacity-80 group-hover:opacity-100"}
            />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="mt-4 flex flex-col gap-0.5 border border-black/5 bg-white/80 backdrop-blur-xl p-1.5 text-foreground shadow-2xl rounded-xl min-w-[200px]">
          <div className="px-3 pt-1.5 pb-1 mb-1 border-b border-black/5">
            <span className="text-[10px] font-medium uppercase tracking-wider text-black/40">Shapes</span>
          </div>
          {item.value.map((elem) => (
            <div
              key={elem?.name}
              onClick={() => {
                handleActiveElement(elem);
              }}
              className={`flex items-center justify-between gap-4 rounded-lg px-3 py-2 cursor-pointer transition-all
                ${activeElement.value === elem?.value 
                  ? "bg-black/[0.08] text-black shadow-sm border border-black/5" 
                  : "hover:bg-black/5 text-black/60 hover:text-black"}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1 rounded-md ${activeElement.value === elem?.value ? "bg-black/10" : "bg-black/5"}`}>
                  <Image
                    src={elem?.icon as string}
                    alt={elem?.name as string}
                    width={16}
                    height={16}
                    className={activeElement.value === elem?.value ? "invert" : "invert opacity-70"}
                  />
                </div>
                <p className="text-sm font-medium">{elem?.name}</p>
              </div>
              {activeElement.value === elem?.value && (
                <div className="w-1.5 h-1.5 rounded-full bg-black/80 shadow-[0_0_8px_rgba(0,0,0,0.2)]" />
              )}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        type="file"
        className="hidden"
        ref={imageInputRef}
        accept="image/*"
        onChange={handleImageUpload}
      />
    </>
  );
};

export default ShapesMenu;
