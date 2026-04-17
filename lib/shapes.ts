import { fabric } from "fabric";
import { v4 as uuidv4 } from "uuid";

import {
  CustomFabricObject,
  ElementDirection,
  ImageUpload,
  ModifyShape,
} from "@/types/type";

export const createRectangle = (pointer: PointerEvent) => {
  const rect = new fabric.Rect({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as CustomFabricObject<fabric.Rect>);

  return rect;
};

export const createTriangle = (pointer: PointerEvent) => {
  return new fabric.Triangle({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as CustomFabricObject<fabric.Triangle>);
};

export const createCircle = (pointer: PointerEvent) => {
  return new fabric.Circle({
    left: pointer.x,
    top: pointer.y,
    radius: 100,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as any);
};

export const createLine = (pointer: PointerEvent) => {
  return new fabric.Line(
    [pointer.x, pointer.y, pointer.x + 100, pointer.y + 100],
    {
      stroke: "#aabbcc",
      strokeWidth: 2,
      objectId: uuidv4(),
    } as CustomFabricObject<fabric.Line>
  );
};

export const createOutlineRect = (pointer: PointerEvent) => {
  return new fabric.Rect({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: "transparent",
    stroke: "#aabbcc",
    strokeWidth: 2,
    objectId: uuidv4(),
  } as CustomFabricObject<fabric.Rect>);
};

export const createOutlineCircle = (pointer: PointerEvent) => {
  return new fabric.Circle({
    left: pointer.x,
    top: pointer.y,
    radius: 100,
    fill: "transparent",
    stroke: "#aabbcc",
    strokeWidth: 2,
    objectId: uuidv4(),
  } as any);
};

export const createOutlineTriangle = (pointer: PointerEvent) => {
  return new fabric.Triangle({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: "transparent",
    stroke: "#aabbcc",
    strokeWidth: 2,
    objectId: uuidv4(),
  } as CustomFabricObject<fabric.Triangle>);
};

export const buildArrowPath = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return `M ${x1} ${y1} L ${x1 + 1} ${y1}`;
  const headLen = Math.min(20, len * 0.35);
  const angle = Math.atan2(dy, dx);
  const spread = Math.PI / 6;
  const hx1 = x2 - headLen * Math.cos(angle - spread);
  const hy1 = y2 - headLen * Math.sin(angle - spread);
  const hx2 = x2 - headLen * Math.cos(angle + spread);
  const hy2 = y2 - headLen * Math.sin(angle + spread);
  return `M ${x1} ${y1} L ${x2} ${y2} M ${x2} ${y2} L ${hx1} ${hy1} M ${x2} ${y2} L ${hx2} ${hy2}`;
};

export const buildDoubleArrowPath = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return `M ${x1} ${y1} L ${x1 + 1} ${y1}`;
  const headLen = Math.min(20, len * 0.35);
  const angle = Math.atan2(dy, dx);
  const spread = Math.PI / 6;
  // forward head
  const fhx1 = x2 - headLen * Math.cos(angle - spread);
  const fhy1 = y2 - headLen * Math.sin(angle - spread);
  const fhx2 = x2 - headLen * Math.cos(angle + spread);
  const fhy2 = y2 - headLen * Math.sin(angle + spread);
  // backward head
  const bhx1 = x1 + headLen * Math.cos(angle - spread);
  const bhy1 = y1 + headLen * Math.sin(angle - spread);
  const bhx2 = x1 + headLen * Math.cos(angle + spread);
  const bhy2 = y1 + headLen * Math.sin(angle + spread);
  return (
    `M ${x1} ${y1} L ${x2} ${y2}` +
    ` M ${x2} ${y2} L ${fhx1} ${fhy1} M ${x2} ${y2} L ${fhx2} ${fhy2}` +
    ` M ${x1} ${y1} L ${bhx1} ${bhy1} M ${x1} ${y1} L ${bhx2} ${bhy2}`
  );
};

export const createArrow = (pointer: PointerEvent) => {
  const x1 = pointer.x;
  const y1 = pointer.y;
  const path = new fabric.Path(buildArrowPath(x1, y1, x1 + 2, y1), {
    stroke: "#aabbcc",
    strokeWidth: 2,
    fill: "transparent",
    strokeLineCap: "round",
    strokeLineJoin: "round",
    objectId: uuidv4(),
  } as any) as any;
  path._arrowX1 = x1;
  path._arrowY1 = y1;
  path.subType = "arrow";
  return path;
};

export const createDoubleArrow = (pointer: PointerEvent) => {
  const x1 = pointer.x;
  const y1 = pointer.y;
  const path = new fabric.Path(buildDoubleArrowPath(x1, y1, x1 + 2, y1), {
    stroke: "#aabbcc",
    strokeWidth: 2,
    fill: "transparent",
    strokeLineCap: "round",
    strokeLineJoin: "round",
    objectId: uuidv4(),
  } as any) as any;
  path._arrowX1 = x1;
  path._arrowY1 = y1;
  path.subType = "arrow-double";
  return path;
};

export const createText = (pointer: PointerEvent, text: string) => {
  return new fabric.IText(text, {
    left: pointer.x,
    top: pointer.y,
    fill: "#aabbcc",
    fontFamily: "Helvetica",
    fontSize: 36,
    fontWeight: "400",
    objectId: uuidv4()
  } as fabric.ITextOptions);
};

export const createSpecificShape = (
  shapeType: string,
  pointer: PointerEvent
) => {
  switch (shapeType) {
    case "rectangle":
      return createRectangle(pointer);

    case "triangle":
      return createTriangle(pointer);

    case "circle":
      return createCircle(pointer);

    case "line":
      return createLine(pointer);

    case "text":
      return createText(pointer, "Tap to Type");

    case "rect-outline":
      return createOutlineRect(pointer);

    case "circle-outline":
      return createOutlineCircle(pointer);

    case "triangle-outline":
      return createOutlineTriangle(pointer);

    case "arrow":
      return createArrow(pointer);

    case "arrow-double":
      return createDoubleArrow(pointer);

    default:
      return null;
  }
};

export const handleImageUpload = ({
  file,
  canvas,
  shapeRef,
  syncShapeInStorage,
}: ImageUpload) => {
  const reader = new FileReader();

  reader.onload = () => {
    fabric.Image.fromURL(reader.result as string, (img) => {
      img.scaleToWidth(200);
      img.scaleToHeight(200);

      canvas.current.add(img);

      // @ts-ignore
      img.objectId = uuidv4();

      shapeRef.current = img;

      syncShapeInStorage(img);
      canvas.current.requestRenderAll();
    });
  };

  reader.readAsDataURL(file);
};

export const createShape = (
  canvas: fabric.Canvas,
  pointer: PointerEvent,
  shapeType: string
) => {
  if (shapeType === "freeform") {
    canvas.isDrawingMode = true;
    return null;
  }

  return createSpecificShape(shapeType, pointer);
};

export const modifyShape = ({
  canvas,
  property,
  value,
  activeObjectRef,
  syncShapeInStorage,
}: ModifyShape) => {
  const selectedElement = canvas.getActiveObject();

  if (!selectedElement || selectedElement?.type === "activeSelection") return;

  // if  property is width or height, set the scale of the selected element
  if (property === "width") {
    selectedElement.set("scaleX", 1);
    selectedElement.set("width", value);  
  } else if (property === "height") {
    selectedElement.set("scaleY", 1);
    selectedElement.set("height", value);
  } else {
    if (selectedElement[property as keyof object] === value) return;
    selectedElement.set(property as keyof object, value);
  }

  // re-render immediately so the change is visible without waiting for storage sync
  canvas.requestRenderAll();

  activeObjectRef.current = selectedElement;

  syncShapeInStorage(selectedElement);
};

export const bringElement = ({
  canvas,
  direction,
  syncShapeInStorage,
}: ElementDirection) => {
  if (!canvas) return;

  // get the selected element. If there is no selected element or there are more than one selected element, return
  const selectedElement = canvas.getActiveObject();

  if (!selectedElement || selectedElement?.type === "activeSelection") return;

  // bring the selected element to the front
  if (direction === "front") {
    canvas.bringToFront(selectedElement);
  } else if (direction === "back") {
    canvas.sendToBack(selectedElement);
  }

  // canvas.renderAll();
  syncShapeInStorage(selectedElement);

  // re-render all objects on the canvas
};