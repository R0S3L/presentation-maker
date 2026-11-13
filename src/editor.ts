import type { Presentation } from './types/presentation';

let currentPresentation: Presentation | null = null;
let past: Presentation[] = [];
let future: Presentation[] = [];
let historyTransactionStart: Presentation | null = null;
const editorChangeHandlers = new Set<() => void>();

function setInitialState(presentation: Presentation): void {
  currentPresentation = presentation;
  past = [];
  future = [];
  historyTransactionStart = null;
}

function getState(): Presentation | null {
  return currentPresentation;
}

function getHistoryState(): { canUndo: boolean; canRedo: boolean } {
  return {
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
}

type Modifier<P = any> = (model: Presentation, params: P) => Presentation;

function notifyEditorChange(): void {
  editorChangeHandlers.forEach(handler => handler());
}

function addEditorChangeHandler(handler: () => void): () => void {
  editorChangeHandlers.add(handler);
  return () => editorChangeHandlers.delete(handler);
}

function beginHistoryTransaction(): void {
  if (!currentPresentation || historyTransactionStart) return;
  historyTransactionStart = currentPresentation;
}

function endHistoryTransaction(): void {
  if (!historyTransactionStart) return;

  const initialPresentation = historyTransactionStart;
  historyTransactionStart = null;

  if (currentPresentation === initialPresentation) return;

  past = [...past, initialPresentation];
  future = [];
  notifyEditorChange();
}

function dispatch(modifier: Modifier, params: any = null): void {
  if (!currentPresentation) {
    console.error('State is not initialized! Call setInitialState first.');
    return;
  }

  if (!historyTransactionStart) {
    past = [...past, currentPresentation];
    future = [];
  }
  currentPresentation = modifier(currentPresentation, params);

  notifyEditorChange();
}

function undo(): void {
  if (historyTransactionStart || !currentPresentation || past.length === 0) return;

  future = [currentPresentation, ...future];
  currentPresentation = past[past.length - 1];
  past = past.slice(0, -1);
  notifyEditorChange();
}

function redo(): void {
  if (historyTransactionStart || !currentPresentation || future.length === 0) return;

  past = [...past, currentPresentation];
  currentPresentation = future[0];
  future = future.slice(1);
  notifyEditorChange();
}

export {
  setInitialState,
  getState,
  getHistoryState,
  addEditorChangeHandler,
  beginHistoryTransaction,
  endHistoryTransaction,
  dispatch,
  undo,
  redo,
};
