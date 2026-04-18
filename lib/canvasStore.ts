type State = {
  canvasObjects: Map<string, any>;
  history: Array<Record<string, any>>;
  historyIndex: number;
};

const STORAGE_KEY = "figma-canvas-objects";

function mapToObj(m: Map<string, any>): Record<string, any> {
  const o: Record<string, any> = {};
  m.forEach((v, k) => {
    o[k] = v;
  });
  return o;
}

function objToMap(o: Record<string, any>): Map<string, any> {
  return new Map(Object.entries(o));
}

function loadFromStorage(): Map<string, any> {
  if (typeof window === "undefined") return new Map();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? objToMap(JSON.parse(raw)) : new Map();
  } catch {
    return new Map();
  }
}

function saveToStorage(m: Map<string, any>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mapToObj(m)));
  } catch {}
}

const initial = loadFromStorage();

const state: State = {
  canvasObjects: initial,
  history: [mapToObj(initial)],
  historyIndex: 0,
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function pushHistory() {
  state.history = state.history.slice(0, state.historyIndex + 1);
  state.history.push(mapToObj(state.canvasObjects));
  state.historyIndex++;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): Map<string, any> {
  return state.canvasObjects;
}

export function getServerSnapshot(): Map<string, any> {
  return new Map();
}

// Silent: updates the map + localStorage but skips React notification and history.
// Used during intermediate mouse:move draws to avoid re-rendering the canvas mid-stroke.
export function setShapeSilent(id: string, shape: any) {
  state.canvasObjects.set(id, shape);
  saveToStorage(state.canvasObjects);
}

// Full update: saves, pushes a history snapshot, and notifies React subscribers.
export function setShape(id: string, shape: any) {
  const next = new Map(state.canvasObjects);
  next.set(id, shape);
  state.canvasObjects = next;
  saveToStorage(state.canvasObjects);
  pushHistory();
  notify();
}

export function deleteShape(id: string) {
  const next = new Map(state.canvasObjects);
  next.delete(id);
  state.canvasObjects = next;
  saveToStorage(state.canvasObjects);
  pushHistory();
  notify();
}

export function clearShapes() {
  state.canvasObjects = new Map();
  saveToStorage(state.canvasObjects);
  pushHistory();
  notify();
}

export function reorderShapes(orderedIds: string[]) {
  const next = new Map<string, any>();
  orderedIds.forEach((id) => {
    const shape = state.canvasObjects.get(id);
    if (shape) next.set(id, shape);
  });
  state.canvasObjects = next;
  saveToStorage(state.canvasObjects);
  pushHistory();
  notify();
}

export function undo() {
  if (state.historyIndex <= 0) return;
  state.historyIndex--;
  state.canvasObjects = objToMap(state.history[state.historyIndex]);
  saveToStorage(state.canvasObjects);
  notify();
}

export function redo() {
  if (state.historyIndex >= state.history.length - 1) return;
  state.historyIndex++;
  state.canvasObjects = objToMap(state.history[state.historyIndex]);
  saveToStorage(state.canvasObjects);
  notify();
}
