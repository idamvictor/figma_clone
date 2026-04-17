import { useCallback } from "react";
import { useSyncExternalStore } from "react";

import * as canvasStore from "./lib/canvasStore";

type StorageRoot = { canvasObjects: Map<string, any> };

type CanvasObjectsProxy = {
  set: (id: string, shape: any) => void;
  delete: (id: string) => void;
  entries: () => IterableIterator<[string, any]>;
  size: number;
};

type StorageProxy = {
  get: (key: "canvasObjects") => CanvasObjectsProxy;
};

function createStorage(): StorageProxy {
  return {
    get(_key) {
      const map = canvasStore.getSnapshot();
      return {
        set: canvasStore.setShape,
        delete: canvasStore.deleteShape,
        entries: () => map.entries(),
        get size() {
          return canvasStore.getSnapshot().size;
        },
      };
    },
  };
}

export function useStorage<T>(selector: (root: StorageRoot) => T): T {
  return useSyncExternalStore(
    canvasStore.subscribe,
    () => selector({ canvasObjects: canvasStore.getSnapshot() }),
    () => selector({ canvasObjects: new Map() })
  );
}

export function useMutation<A extends any[]>(
  fn: (ctx: { storage: StorageProxy }, ...args: A) => void,
  _deps: any[]
): (...args: A) => void {
  return useCallback(
    (...args: A) => {
      fn({ storage: createStorage() }, ...args);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
}

export function useUndo(): () => void {
  return canvasStore.undo;
}

export function useRedo(): () => void {
  return canvasStore.redo;
}
