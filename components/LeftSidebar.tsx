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
    <section className="flex flex-col border-r bg-background text-muted-foreground w-64 pt-5 h-full max-sm:hidden select-none overflow-y-auto pb-20 transition-all">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border mb-2">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Layers</h3>
        <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded border border-border text-foreground/60">{allShapes?.length || 0}</span>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="layers">
          {(provided) => (
            <div
              className="flex flex-col gap-0.5 px-2"
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
                        className={`group relative flex items-center gap-3 px-3 py-2 rounded-md transition-all cursor-pointer
                          ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground/70 hover:text-foreground"}
                          ${snapshot.isDragging ? "shadow-lg ring-1 ring-primary bg-background scale-105 z-50" : ""}`}
                      >
                         <span
                          {...drag.dragHandleProps}
                          className="opacity-80 group-hover:opacity-100 transition-opacity pr-1.5 text-xs text-foreground/50"
                          title="Drag to reorder"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3"><path d="M5.5 4.5C5.5 5.05228 5.05228 5.5 4.5 5.5C3.94772 5.5 3.5 5.05228 3.5 4.5C3.5 3.94772 3.94772 3.5 4.5 3.5C5.05228 3.5 5.5 3.94772 5.5 4.5ZM5.5 7.5C5.5 8.05228 5.05228 8.5 4.5 8.5C3.94772 8.5 3.5 8.05228 3.5 7.5C3.5 6.94772 3.94772 6.5 4.5 6.5C5.05228 6.5 5.5 6.94772 5.5 7.5ZM4.5 11.5C5.05228 11.5 5.5 11.0523 5.5 10.5C5.5 9.94772 5.05228 9.5 4.5 9.5C3.94772 9.5 3.5 9.94772 3.5 10.5C3.5 11.0523 3.94772 11.5 4.5 11.5ZM10.5 5.5C11.0523 5.5 11.5 5.05228 11.5 4.5C11.5 3.94772 11.0523 3.5 10.5 3.5C9.94772 3.5 9.5 3.94772 9.5 4.5C9.5 5.05228 9.94772 5.5 10.5 5.5ZM11.5 7.5C11.5 8.05228 11.0523 8.5 10.5 8.5C9.94772 8.5 9.5 8.05228 9.5 7.5C9.5 6.94772 9.94772 6.5 10.5 6.5C11.0523 6.5 11.5 6.94772 11.5 7.5ZM10.5 11.5C11.0523 11.5 11.5 11.0523 11.5 10.5C11.5 9.94772 11.0523 9.5 10.5 9.5C9.94772 9.5 9.5 9.94772 9.5 10.5C9.5 11.0523 9.94772 11.5 10.5 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                        </span>
                        
                        <div className={`p-1.5 rounded ${isActive ? "bg-primary-foreground/20" : "bg-secondary"}`}>
                          <Image
                            src={info?.icon}
                            alt="Layer"
                            width={14}
                            height={14}
                            className={isActive ? "" : "invert opacity-80"}
                          />
                        </div>
                        
                        <h3 className="text-[13px] font-medium capitalize flex-1 truncate">{info.name}</h3>
                        
                        <button
                          onClick={(e) => { e.stopPropagation(); handleLayerDelete(objectId); }}
                          className={`opacity-0 group-hover:opacity-100 p-1 rounded-sm hover:bg-destructive/20 hover:text-destructive transition-all
                            ${isActive ? "text-white/70 hover:text-white" : "text-muted-foreground"}`}
                          title="Delete layer"
                        >
                          <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                        </button>

                        {isActive && (
                          <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-full" />
                        )}
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
