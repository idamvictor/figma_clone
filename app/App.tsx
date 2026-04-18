"use client";

import { fabric } from "fabric";
import { useCallback, useEffect, useRef, useState } from "react";

import { useMutation, useRedo, useStorage, useUndo } from "@/liveblocks.config";
import * as canvasStore from "@/lib/canvasStore";
import {
  handleCanvaseMouseMove,
  handleCanvasMouseDown,
  handleCanvasMouseUp,
  handleCanvasObjectModified,
  handleCanvasObjectMoving,
  handleCanvasObjectScaling,
  handleCanvasSelectionCreated,
  handleCanvasZoom,
  handlePathCreated,
  handleResize,
  initializeFabric,
  renderCanvas,
} from "@/lib/canvas";
import { handleDelete, handleKeyDown } from "@/lib/key-events";
import { LeftSidebar, Live, Navbar, RightSidebar } from "@/components/index";
import { handleImageUpload } from "@/lib/shapes";
import { defaultNavElement } from "@/constants";
import { ActiveElement, Attributes } from "@/types/type";

const Home = () => {
  const undo = useUndo();
  const redo = useRedo();

  const canvasObjects = useStorage((root) => root.canvasObjects);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>(null);
  const activeObjectRef = useRef<fabric.Object | null>(null);
  const isEditingRef = useRef(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const isPanningRef = useRef(false);
  const lastPanPointRef = useRef<{ x: number; y: number } | null>(null);
  const isSpaceDownRef = useRef(false);

  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: "",
    value: "",
    icon: "",
  });

  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  const [elementAttributes, setElementAttributes] = useState<Attributes>({
    width: "",
    height: "",
    fontSize: "",
    fontFamily: "",
    fontWeight: "",
    fill: "#aabbcc",
    stroke: "#aabbcc",
    opacity: "100",
  });

  const deleteShapeFromStorage = useMutation(({ storage }, shapeId) => {
    const canvasObjects = storage.get("canvasObjects");
    canvasObjects.delete(shapeId);
  }, []);

  const deleteAllShapes = useCallback(() => {
    canvasStore.clearShapes();
  }, []);

  const handleLayerSelect = useCallback((objectId: string) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const target = canvas.getObjects().find((obj: any) => obj.objectId === objectId);
    if (!target) return;
    canvas.setActiveObject(target);
    canvas.requestRenderAll();
    handleCanvasSelectionCreated({
      options: { selected: [target] } as any,
      isEditingRef,
      setElementAttributes,
    });
    setSelectedObjectId(objectId);
  }, [isEditingRef]);

  const handleLayerReorder = useCallback((orderedIds: string[]) => {
    canvasStore.reorderShapes(orderedIds);
    const canvas = fabricRef.current;
    if (!canvas) return;
    orderedIds.forEach((id, index) => {
      const obj = canvas.getObjects().find((o: any) => o.objectId === id);
      if (obj) canvas.moveTo(obj, index);
    });
    canvas.requestRenderAll();
  }, [fabricRef]);

  const handleLayerDelete = useCallback((objectId: string) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const obj = canvas.getObjects().find((o: any) => o.objectId === objectId);
    if (obj) {
      canvas.remove(obj);
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    }
    deleteShapeFromStorage(objectId);
    setSelectedObjectId((prev: string | null) => (prev === objectId ? null : prev));
  }, [fabricRef, deleteShapeFromStorage]);

  const syncShapeInStorage = useMutation(({ storage }, object) => {
    if (!object) return;
    const { objectId } = object;
    const shapeData = object.toJSON();
    shapeData.objectId = objectId;
    if ((object as any).subType) shapeData.subType = (object as any).subType;
    const canvasObjects = storage.get("canvasObjects");
    canvasObjects.set(objectId, shapeData);
  }, []);

  // Silent variant: writes to localStorage without notifying React or pushing history.
  // Passed to mouse:move so the canvas isn't re-rendered mid-stroke.
  const syncShapeInStorageSilent = useCallback(
    (object: fabric.Object | null) => {
      if (!object) return;
      const obj = object as any;
      if (!obj.objectId) return;
      const shapeData = object.toJSON() as any;
      shapeData.objectId = obj.objectId;
      if (obj.subType) shapeData.subType = obj.subType;
      canvasStore.setShapeSilent(obj.objectId, shapeData);
    },
    []
  );

  const handleActiveElement = (elem: ActiveElement) => {
    setActiveElement(elem);

    switch (elem?.value) {
      case "reset":
        deleteAllShapes();
        fabricRef.current?.clear();
        setActiveElement(defaultNavElement);
        break;

      case "delete":
        handleDelete(fabricRef.current as any, deleteShapeFromStorage);
        setActiveElement(defaultNavElement);
        break;

      case "image":
        imageInputRef.current?.click();
        isDrawing.current = false;
        if (fabricRef.current) {
          fabricRef.current.isDrawingMode = false;
        }
        break;

      default:
        selectedShapeRef.current = elem?.value as string;
        break;
    }
  };

  useEffect(() => {
    const canvas = initializeFabric({ canvasRef, fabricRef });

    canvas.on("mouse:down", (options) => {
      const e = options.e as MouseEvent;
      if (isSpaceDownRef.current || e.button === 1) {
        isPanningRef.current = true;
        lastPanPointRef.current = { x: e.clientX, y: e.clientY };
        canvas.setCursor(isSpaceDownRef.current ? "grabbing" : "all-scroll");
        canvas.selection = false;
        return;
      }
      handleCanvasMouseDown({
        options,
        canvas,
        selectedShapeRef,
        isDrawing,
        shapeRef,
      });
    });

    canvas.on("mouse:move", (options) => {
      if (isPanningRef.current && lastPanPointRef.current) {
        const e = options.e as MouseEvent;
        canvas.relativePan(
          new fabric.Point(
            e.clientX - lastPanPointRef.current.x,
            e.clientY - lastPanPointRef.current.y
          )
        );
        lastPanPointRef.current = { x: e.clientX, y: e.clientY };
        canvas.requestRenderAll();
        return;
      }
      handleCanvaseMouseMove({
        options,
        canvas,
        isDrawing,
        selectedShapeRef,
        shapeRef,
        syncShapeInStorage: syncShapeInStorageSilent,
      });
    });

    canvas.on("mouse:up", () => {
      if (isPanningRef.current) {
        isPanningRef.current = false;
        lastPanPointRef.current = null;
        canvas.selection = true;
        canvas.setCursor(isSpaceDownRef.current ? "grab" : "default");
        return;
      }
      handleCanvasMouseUp({
        canvas,
        isDrawing,
        shapeRef,
        activeObjectRef,
        selectedShapeRef,
        syncShapeInStorage,
        setActiveElement,
      });
    });

    canvas.on("path:created", (options) => {
      handlePathCreated({
        options,
        syncShapeInStorage,
      });
    });

    canvas.on("object:modified", (options) => {
      handleCanvasObjectModified({
        options,
        syncShapeInStorage,
      });
    });

    canvas?.on("object:moving", (options) => {
      handleCanvasObjectMoving({ options });
    });

    canvas.on("selection:created", (options) => {
      handleCanvasSelectionCreated({
        options,
        isEditingRef,
        setElementAttributes,
      });
      const selected = options?.selected?.[0] as any;
      setSelectedObjectId(selected?.objectId || null);
    });

    canvas.on("selection:updated", (options) => {
      handleCanvasSelectionCreated({
        options,
        isEditingRef,
        setElementAttributes,
      });
      const selected = options?.selected?.[0] as any;
      setSelectedObjectId(selected?.objectId || null);
    });

    canvas.on("selection:cleared", () => {
      setSelectedObjectId(null);
    });

    canvas.on("object:scaling", (options) => {
      handleCanvasObjectScaling({
        options,
        setElementAttributes,
      });
    });

    canvas.on("mouse:wheel", (options) => {
      handleCanvasZoom({ options, canvas });
    });

    window.addEventListener("resize", () => {
      handleResize({ canvas: fabricRef.current });
    });

    window.addEventListener("keydown", (e) =>
      handleKeyDown({
        e,
        canvas: fabricRef.current,
        undo,
        redo,
        syncShapeInStorage,
        deleteShapeFromStorage,
      })
    );

    const onSpaceDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.code === "Space" && !isSpaceDownRef.current) {
        isSpaceDownRef.current = true;
        canvas.defaultCursor = "grab";
        canvas.hoverCursor = "grab";
        canvas.setCursor("grab");
        e.preventDefault();
      }
    };
    const onSpaceUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isSpaceDownRef.current = false;
        isPanningRef.current = false;
        canvas.defaultCursor = "default";
        canvas.hoverCursor = "move";
        canvas.setCursor("default");
      }
    };
    document.addEventListener("keydown", onSpaceDown);
    document.addEventListener("keyup", onSpaceUp);

    return () => {
      canvas.dispose();
      document.removeEventListener("keydown", onSpaceDown);
      document.removeEventListener("keyup", onSpaceUp);
      window.removeEventListener("resize", () => {
        handleResize({ canvas: null });
      });
      window.removeEventListener("keydown", (e) =>
        handleKeyDown({
          e,
          canvas: fabricRef.current,
          undo,
          redo,
          syncShapeInStorage,
          deleteShapeFromStorage,
        })
      );
    };
  }, [canvasRef]);

  useEffect(() => {
    renderCanvas({
      fabricRef,
      canvasObjects,
      activeObjectRef,
    });
  }, [canvasObjects]);

  return (
    <main className='h-screen overflow-hidden'>
      <Navbar
        imageInputRef={imageInputRef}
        activeElement={activeElement}
        handleImageUpload={(e: any) => {
          e.stopPropagation();
          handleImageUpload({
            file: e.target.files[0],
            canvas: fabricRef as any,
            shapeRef,
            syncShapeInStorage,
          });
        }}
        handleActiveElement={handleActiveElement}
        undo={undo}
        redo={redo}
      />

      <section className='flex h-full flex-row'>
        <LeftSidebar
          allShapes={Array.from(canvasObjects)}
          selectedObjectId={selectedObjectId}
          handleLayerSelect={handleLayerSelect}
          handleLayerDelete={handleLayerDelete}
          handleLayerReorder={handleLayerReorder}
        />

        <Live canvasRef={canvasRef} undo={undo} redo={redo} />

        <RightSidebar
          elementAttributes={elementAttributes}
          setElementAttributes={setElementAttributes}
          fabricRef={fabricRef}
          isEditingRef={isEditingRef}
          activeObjectRef={activeObjectRef}
          syncShapeInStorage={syncShapeInStorageSilent}
        />
      </section>
    </main>
  );
};

export default Home;
