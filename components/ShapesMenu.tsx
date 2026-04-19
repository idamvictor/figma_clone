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
              className={isDropdownElem ? "" : "invert opacity-80 group-hover:opacity-100"}
            />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="mt-4 flex flex-col gap-0.5 border border-border bg-background p-1.5 text-foreground shadow-xl rounded-lg min-w-[180px]">
          <div className="px-3 pt-1.5 pb-1 mb-1 border-b border-border">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Shapes</span>
          </div>
          {item.value.map((elem) => (
            <div
              key={elem?.name}
              onClick={() => {
                handleActiveElement(elem);
              }}
              className={`flex items-center justify-between gap-4 rounded-md px-3 py-2 cursor-pointer transition-all
                ${activeElement.value === elem?.value ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-foreground/70 hover:text-foreground"}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1 rounded ${activeElement.value === elem?.value ? "bg-white/20" : "bg-muted"}`}>
                  <Image
                    src={elem?.icon as string}
                    alt={elem?.name as string}
                    width={16}
                    height={16}
                    className={activeElement.value === elem?.value ? "" : "invert opacity-80"}
                  />
                </div>
                <p className="text-sm font-medium">{elem?.name}</p>
              </div>
              {activeElement.value === elem?.value && (
                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
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
