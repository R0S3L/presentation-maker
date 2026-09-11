import type {Slide, Background} from './types/slide';
import type {Presentation} from './types/presentation';
import type {SlideObject, TextObject, ImageObject } from './types/objects';

import { createPresentation, updatePresentationName, savePresentation, loadPresentation } from './functions/presentationFunc';
import { addSlide, removeSlides, moveSlide, setActiveSlide, duplicateSlide, setSlideBackgroundColor, setSlideBackgroundImage, setSlideBackgroundGradient, clearSlideBackground} from './functions/slideFunc';
import { addTextObject, addImageObject, removeObject, moveObject, resizeObject, updateTextObjectStyle } from './functions/objectsFunc';

function generateId(): string{
    const timestamp = Date.now().toString(36);
    const randomValue = Math.random().toString(36).substring(2,8);
    return `${timestamp}+${randomValue}`
}

export type {Slide, Background, Presentation, SlideObject, TextObject, ImageObject};
export { generateId, createPresentation, updatePresentationName, savePresentation, loadPresentation, addSlide, removeSlides, moveSlide, setActiveSlide, duplicateSlide, setSlideBackgroundColor, setSlideBackgroundImage, setSlideBackgroundGradient, clearSlideBackground, addTextObject, addImageObject, removeObject, moveObject, resizeObject, updateTextObjectStyle };