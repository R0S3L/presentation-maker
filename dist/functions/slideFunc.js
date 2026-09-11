import { generateId } from '../index.js';
function addSlide(presentation, slideName = 'Новый слайд') {
    const newSlide = {
        id: generateId(),
        name: slideName,
        background: {
            type: 'none'
        },
        objects: []
    };
    return {
        ...presentation,
        slides: [...presentation.slides, newSlide],
        activeSlideId: newSlide.id
    };
}
function removeSlides(presentation, slideIds) {
    if (presentation.slides.length === 0) {
        return presentation;
    }
    const slides = presentation.slides.filter(slide => !slideIds.includes(slide.id));
    if (slides.length === 0) {
        return {
            ...presentation,
            slides: [],
            activeSlideId: ''
        };
    }
    let activeSlideId = presentation.activeSlideId;
    if (!slides.some(slide => slide.id === activeSlideId)) {
        activeSlideId = slides[0].id;
    }
    return {
        ...presentation,
        slides,
        activeSlideId
    };
}
function moveSlide(presentation, slideId, newIndex) {
    const oldIndex = presentation.slides.findIndex(slide => slide.id === slideId);
    if (oldIndex === -1) {
        return presentation;
    }
    const slides = [...presentation.slides];
    const [slide] = slides.splice(oldIndex, 1);
    const index = Math.max(0, Math.min(newIndex, slides.length));
    slides.splice(index, 0, slide);
    return {
        ...presentation,
        slides
    };
}
function setActiveSlide(presentation, slideId) {
    const slideExists = presentation.slides.some(slide => slide.id === slideId);
    if (!slideExists) {
        return presentation;
    }
    return {
        ...presentation,
        activeSlideId: slideId
    };
}
function duplicateSlide(presentation, slideId) {
    const slideIndex = presentation.slides.findIndex(slide => slide.id === slideId);
    if (slideIndex === -1) {
        return presentation;
    }
    const originalSlide = presentation.slides[slideIndex];
    const newSlide = {
        ...originalSlide,
        id: generateId(),
        name: `${originalSlide.name} (копия)`,
        objects: originalSlide.objects.map(object => ({
            ...object,
            id: generateId()
        }))
    };
    const slides = [...presentation.slides];
    slides.splice(slideIndex + 1, 0, newSlide);
    return {
        ...presentation,
        slides,
        activeSlideId: newSlide.id
    };
}
function setSlideBackgroundColor(slide, color) {
    return {
        ...slide,
        background: {
            type: 'color',
            color
        }
    };
}
function setSlideBackgroundImage(slide, imageUrl) {
    return {
        ...slide,
        background: {
            type: 'image',
            imageUrl
        }
    };
}
function setSlideBackgroundGradient(slide, colors, angle = 0) {
    return {
        ...slide,
        background: {
            type: 'gradient',
            colors: [...colors],
            angle
        }
    };
}
function clearSlideBackground(slide) {
    return {
        ...slide,
        background: {
            type: 'none'
        }
    };
}
export { addSlide, removeSlides, moveSlide, setActiveSlide, duplicateSlide, setSlideBackgroundColor, setSlideBackgroundImage, setSlideBackgroundGradient, clearSlideBackground };
