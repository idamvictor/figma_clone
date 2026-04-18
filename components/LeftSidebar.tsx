"use client";

import { useMemo } from "react";
import Image from "next/image";

import { getShapeInfo } from "@/lib/utils";

type Props = {
  allShapes: Array<any>;
  selectedObjectId: string | null;
  handleLayerSelect: (objectId: string) => void;
  handleLayerDelete: (objectId: string) => void;
};

const LeftSidebar = ({ allShapes, selectedObjectId, handleLayerSelect, handleLayerDelete }: Props) => {
  const memoizedShapes = useMemo(
    () => (
      <section className="flex flex-col border-t border-primary-grey-200 bg-primary-black text-primary-grey-300 min-w-[227px] sticky left-0 h-full max-sm:hidden select-none overflow-y-auto pb-20">
        <h3 className="border border-primary-grey-200 px-5 py-4 text-xs uppercase">Layers</h3>
        <div className="flex flex-col">
          {allShapes?.map((shape: any) => {
            const info = getShapeInfo(shape[1]?.subType || shape[1]?.type);
            const isActive = shape[1]?.objectId === selectedObjectId;

            return (
              <div
                key={shape[1]?.objectId}
                onClick={() => handleLayerSelect(shape[1]?.objectId)}
                className={`group my-1 flex items-center gap-2 px-5 py-2.5 hover:cursor-pointer hover:bg-primary-green hover:text-primary-black ${
                  isActive ? "bg-primary-green text-primary-black" : ""
                }`}
              >
                <Image
                  src={info?.icon}
                  alt='Layer'
                  width={16}
                  height={16}
                  className={isActive ? "invert" : "group-hover:invert"}
                />
                <h3 className='text-sm font-semibold capitalize flex-1'>{info.name}</h3>
                <button
                  onClick={(e) => { e.stopPropagation(); handleLayerDelete(shape[1]?.objectId); }}
                  className="opacity-0 group-hover:opacity-100 pr-1 text-xs hover:text-red-400 transition-opacity"
                  title="Delete layer"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      </section>
    ),
    [allShapes?.length, selectedObjectId, handleLayerDelete]
  );

  return memoizedShapes;
};

export default LeftSidebar;
