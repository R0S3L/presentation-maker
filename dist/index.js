import { createPresentation, updatePresentationName, savePresentation, loadPresentation } from './functions/presentationFunc';
import { addSlide, removeSlides, moveSlide, setActiveSlide, duplicateSlide, setSlideBackgroundColor, setSlideBackgroundImage, setSlideBackgroundGradient, clearSlideBackground } from './functions/slideFunc';
import { addTextObject, addImageObject, removeObject, moveObject, resizeObject, updateTextObjectStyle } from './functions/objectsFunc';
function generateId() {
    const timestamp = Date.now().toString(36);
    const randomValue = Math.random().toString(36).substring(2, 8);
    return `${timestamp}+${randomValue}`;
}
export { generateId, createPresentation, updatePresentationName, savePresentation, loadPresentation, addSlide, removeSlides, moveSlide, setActiveSlide, duplicateSlide, setSlideBackgroundColor, setSlideBackgroundImage, setSlideBackgroundGradient, clearSlideBackground, addTextObject, addImageObject, removeObject, moveObject, resizeObject, updateTextObjectStyle };
