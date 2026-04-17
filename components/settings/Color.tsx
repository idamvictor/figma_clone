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
};

const Color = ({
  inputRef,
  attribute,
  placeholder,
  attributeType,
  handleInputChange,
  opacity,
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
    <div className='flex flex-col gap-3 border-b border-primary-grey-200 p-5'>
      <h3 className='text-[10px] uppercase'>{placeholder}</h3>
      <div
        className='flex items-center gap-2 border border-primary-grey-200'
        onClick={() => inputRef.current.click()}
      >
        <input
          type='color'
          value={attribute}
          ref={inputRef}
          onChange={(e) => handleInputChange(attributeType, e.target.value)}
        />
        <Label className='flex-1'>{attribute}</Label>

        {opacity !== undefined && (
          <div className='relative'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSlider((v) => !v);
              }}
              className='flex h-6 w-12 items-center justify-center bg-primary-grey-100 text-[10px] leading-3 text-primary-grey-300 hover:bg-primary-grey-200 transition-colors'
            >
              {opacity}%
            </button>

            {showSlider && (
              <div
                ref={sliderRef}
                onClick={(e) => e.stopPropagation()}
                className='absolute right-0 top-8 z-50 flex flex-col gap-2 rounded bg-primary-black border border-primary-grey-200 p-3 shadow-lg w-40'
              >
                <div className='flex items-center justify-between text-[10px] text-primary-grey-300'>
                  <span>Opacity</span>
                  <span>{opacity}%</span>
                </div>
                <input
                  type='range'
                  min={0}
                  max={100}
                  value={opacity}
                  onChange={(e) => handleInputChange("opacity", e.target.value)}
                  className='w-full accent-primary-green cursor-pointer'
                />
                <div className='flex justify-between text-[9px] text-primary-grey-300'>
                  <span>0</span>
                  <span>100</span>
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
