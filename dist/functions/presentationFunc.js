import { generateId } from '../index.js';
function createPresentation(name) {
    const titleSlideId = generateId();
    return {
        id: generateId(),
        name: name,
        slides: [
            {
                id: titleSlideId,
                name: "Title",
                background: { type: 'none' },
                objects: [],
            }
        ],
        activeSlideId: titleSlideId
    };
}
function updatePresentationName(presentation, name) {
    return {
        ...presentation,
        name: name
    };
}
function savePresentation(presentation) {
    return JSON.stringify(presentation);
}
function loadPresentation(jsonString) {
    return JSON.parse(jsonString);
}
export { createPresentation, updatePresentationName, savePresentation, loadPresentation };
