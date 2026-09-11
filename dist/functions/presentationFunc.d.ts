import type { Presentation } from "../types/presentation";
declare function createPresentation(name: string): Presentation;
declare function updatePresentationName(presentation: Presentation, name: string): Presentation;
declare function savePresentation(presentation: Presentation): string;
declare function loadPresentation(jsonString: string): Presentation;
export { createPresentation, updatePresentationName, savePresentation, loadPresentation };
