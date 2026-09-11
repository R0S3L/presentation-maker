import type { Presentation } from "../types/presentation";
import { generateId } from '../index.js';

function createPresentation(name: string): Presentation{
    const titleSlideId = generateId();
    return{
        id: generateId(),
        name: name,
        slides: [
            {
                id: titleSlideId,
                name: "Title",
                background: {type: 'none'},
                objects: [],
            }
        ],
        activeSlideId: titleSlideId
    };
}

function updatePresentationName(presentation: Presentation, name: string): Presentation{
    return{
        ...presentation,
        name: name
    }
}

function savePresentation(presentation: Presentation): string{
    return JSON.stringify(presentation);
}

function loadPresentation(jsonString: string): Presentation{
    return JSON.parse(jsonString);
}

export {createPresentation, updatePresentationName, savePresentation, loadPresentation};