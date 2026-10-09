import { Presentation } from '../types/presentation';
import { Slide } from '../types/slide';
import { generateId } from '../index.js';

function addSlide( presentation: Presentation, slideName: string = 'Новый слайд'): Presentation {
    const newSlide: Slide = {
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

function updateSlide(
  presentation: Presentation,
  slideId: string,
  update: (slide: Slide) => Slide,
): Presentation {
  return {
    ...presentation,
    slides: presentation.slides.map(slide =>
      slide.id === slideId ? update(slide) : slide,
    ),
  };
}

function removeSlides(presentation: Presentation,slideIds: string[]): Presentation {
    if (presentation.slides.length === 0) {
        return presentation;
    }

    const slides = presentation.slides.filter(
        slide => !slideIds.includes(slide.id)
    );

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

function moveSlide(presentation: Presentation,slideId: string,newIndex: number): Presentation {
    const oldIndex = presentation.slides.findIndex(
        slide => slide.id === slideId
    );

    if (oldIndex === -1) {
        return presentation;
    }

    const slides = [...presentation.slides];

    const [slide] = slides.splice(oldIndex, 1);

    const index = Math.max(
        0,
        Math.min(newIndex, slides.length)
    );

    slides.splice(index, 0, slide);

    return {
        ...presentation,
        slides
    };
}

function setActiveSlide(presentation: Presentation,slideId: string): Presentation {
    const slideExists = presentation.slides.some(
        slide => slide.id === slideId
    );

    if (!slideExists) {
        return presentation;
    }

    return {
        ...presentation,
        activeSlideId: slideId
    };
}

function duplicateSlide(presentation: Presentation,slideId: string): Presentation {
    const slideIndex = presentation.slides.findIndex(
        slide => slide.id === slideId
    );

    if (slideIndex === -1) {
        return presentation;
    }

    const originalSlide = presentation.slides[slideIndex];

    const newSlide: Slide = {
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

function setSlideBackgroundColor(slide: Slide,color: string): Slide {
    return {
        ...slide,
        background: {
            type: 'color',
            color
        }
    };
}

function setSlideBackgroundImage( slide: Slide,imageUrl: string): Slide {
    return {
        ...slide,
        background: {
            type: 'image',
            imageUrl
        }
    };
}

function setSlideBackgroundGradient(slide: Slide,colors: string[], angle: number = 0): Slide {
    return {
        ...slide,
        background: {
            type: 'gradient',
            colors: [...colors],
            angle
        }
    };
}

function clearSlideBackground(slide: Slide): Slide {
    return {
        ...slide,
        background: {
            type: 'none'
        }
    };
}

export { addSlide, updateSlide, removeSlides, moveSlide, setActiveSlide, duplicateSlide, setSlideBackgroundColor, setSlideBackgroundImage, setSlideBackgroundGradient, clearSlideBackground };