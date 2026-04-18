"use client";

import Image from "next/image";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";

import { getShapeInfo } from "@/lib/utils";

type Props = {
  allShapes: Array<any>;
  selectedObjectId: string | null;
  handleLayerSelect: (objectId: string) => void;
  handleLayerDelete: (objectId: string) => void;
  handleLayerReorder: (orderedIds: string[]) => void;
};

const LeftSidebar = ({ allShapes, selectedObjectId, handleLayerSelect, handleLayerDelete, handleLayerReorder }: Props) => {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination || result.destination.index === result.source.index) return;

    const reordered = Array.from(allShapes);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    handleLayerReorder(reordered.map((s) => s[1]?.objectId));
  };

  return (
    <section className="flex flex-col border-t border-primary-grey-200 bg-primary-black text-primary-grey-300 min-w-[227px] sticky left-0 h-full max-sm:hidden select-none overflow-y-auto pb-20">
      <h3 className="border border-primary-grey-200 px-5 py-4 text-xs uppercase">Layers</h3>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="layers">
          {(provided) => (
            <div
              className="flex flex-col"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {allShapes?.map((shape: any, index: number) => {
                const info = getShapeInfo(shape[1]?.subType || shape[1]?.type);
                const isActive = shape[1]?.objectId === selectedObjectId;
                const objectId = shape[1]?.objectId;

                return (
                  <Draggable key={objectId} draggableId={objectId} index={index}>
                    {(drag, snapshot) => (
                      <div
                        ref={drag.innerRef}
                        {...drag.draggableProps}
                        onClick={() => handleLayerSelect(objectId)}
                        className={`group my-1 flex items-center gap-2 px-5 py-2.5 hover:cursor-pointer hover:bg-primary-green hover:text-primary-black ${
                          isActive ? "bg-primary-green text-primary-black" : ""
                        } ${snapshot.isDragging ? "opacity-70 bg-primary-grey-200" : ""}`}
                      >
                        <span
                          {...drag.dragHandleProps}
                          className="cursor-grab opacity-30 hover:opacity-100 pr-1 text-xs"
                          title="Drag to reorder"
                          onClick={(e) => e.stopPropagation()}
                        >
                          ⠿
                        </span>
                        <Image
                          src={info?.icon}
                          alt="Layer"
                          width={16}
                          height={16}
                          className={isActive ? "invert" : "group-hover:invert"}
                        />
                        <h3 className="text-sm font-semibold capitalize flex-1">{info.name}</h3>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleLayerDelete(objectId); }}
                          className="opacity-0 group-hover:opacity-100 pr-1 text-xs hover:text-red-400 transition-opacity"
                          title="Delete layer"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </section>
  );
};

export default LeftSidebar;
