import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { jsPDF } from "jspdf"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const shapeInfoMap: Record<string, { icon: string; name: string }> = {
  rectangle: { icon: "/assets/rectangle.svg", name: "Rectangle" },
  rect: { icon: "/assets/rectangle.svg", name: "Rectangle" },
  "rect-outline": { icon: "/assets/rect-outline.svg", name: "Rect Outline" },
  circle: { icon: "/assets/circle.svg", name: "Circle" },
  "circle-outline": { icon: "/assets/circle-outline.svg", name: "Circle Outline" },
  triangle: { icon: "/assets/triangle.svg", name: "Triangle" },
  "triangle-outline": { icon: "/assets/triangle-outline.svg", name: "Triangle Outline" },
  line: { icon: "/assets/line.svg", name: "Line" },
  arrow: { icon: "/assets/arrow.svg", name: "Arrow" },
  "arrow-double": { icon: "/assets/arrow-double.svg", name: "Double Arrow" },
  freeform: { icon: "/assets/freeform.svg", name: "Freeform" },
  path: { icon: "/assets/freeform.svg", name: "Freeform" },
  text: { icon: "/assets/text.svg", name: "Text" },
  textbox: { icon: "/assets/text.svg", name: "Text" },
  "i-text": { icon: "/assets/text.svg", name: "Text" },
  image: { icon: "/assets/image.svg", name: "Image" },
};

export function getShapeInfo(type: string) {
  return shapeInfoMap[type] ?? { icon: "/assets/rectangle.svg", name: type ?? "Shape" };
}

export const exportToPdf = (canvas: any) => {
  if (!canvas) return;

  // use jspdf to export the canvas to pdf
  // @ts-ignore
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [canvas.width, canvas.height],
  });

  const data = canvas.toDataURL();

  doc.addImage(data, "PNG", 0, 0, canvas.width, canvas.height);

  doc.save("canvas.pdf");
};
