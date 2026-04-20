"use client";

import { useEffect, useRef, useState } from "react";
import { Label } from "../ui/label";

type Props = {
  inputRef: any;
  attribute: string;
  placeholder: string;
  attributeType: string;
  handleInputChange: (property: string, value: string) => void;
  opacity?: string;
  disabled?: boolean;
};

const Color = ({
  inputRef,
  attribute,
  placeholder,
  attributeType,
  handleInputChange,
  opacity,
  disabled,
}: Props) => {
  const [showSlider, setShowSlider] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showSlider) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (sliderRef.current && !sliderRef.current.contains(e.target as Node)) {
        setShowSlider(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSlider]);

  return (
    <div className={`flex flex-col gap-3 border-b border-border px-5 py-4${disabled ? " opacity-40 pointer-events-none" : ""}`}>
      <span className='text-[10px] font-semibold uppercase tracking-wider text-muted-foreground'>{placeholder}</span>
      
      <div className="flex items-center gap-2">
        <div
          className='flex flex-1 items-center gap-3 bg-background border border-border rounded-md px-2.5 py-1.5 cursor-pointer hover:border-primary/30 hover:bg-muted/50 transition-all'
          onClick={() => inputRef.current.click()}
        >
          <div className="relative w-5 h-5 rounded border border-border shadow-inner overflow-hidden" style={{ backgroundColor: attribute }}>
            <input
              type='color'
              value={attribute}
              ref={inputRef}
              onChange={(e) => handleInputChange(attributeType, e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <Label className='flex-1 text-xs font-mono text-foreground/80 cursor-pointer uppercase'>{attribute}</Label>
        </div>

        {opacity !== undefined && (
          <div className='relative'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSlider((v) => !v);
              }}
              className={`flex h-8 w-12 items-center justify-center rounded-md border border-border text-[10px] font-bold leading-3 transition-all
                ${showSlider ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground hover:bg-muted"}`}
            >
              {opacity}%
            </button>

            {showSlider && (
              <div
                ref={sliderRef}
                onClick={(e) => e.stopPropagation()}
                className='absolute right-0 top-10 z-50 flex flex-col gap-3 rounded-lg bg-background border border-border p-4 shadow-xl w-48 animate-in fade-in zoom-in-95 duration-200'
              >
                <div className='flex items-center justify-between'>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Opacity</span>
                  <span className="text-[11px] font-mono text-primary font-bold">{opacity}%</span>
                </div>
                <input
                  type='range'
                  min={0}
                  max={100}
                  value={opacity}
                  onChange={(e) => handleInputChange("opacity", e.target.value)}
                  className='w-full accent-primary cursor-pointer h-1.5 bg-muted rounded-full appearance-none'
                />
                <div className='flex justify-between text-[9px] text-muted-foreground/50 font-medium'>
                  <span>Transparent</span>
                  <span>Opaque</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Color;
