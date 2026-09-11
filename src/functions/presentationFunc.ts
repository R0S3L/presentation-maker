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
        ]
    };
}

function updatePresentationName(presentation: Presentation, name: string): Presentation{

}

function savePresentation(presentation: Presentation): string{

}

function loadPresentation(presentation: Presentation): Presentation{

}