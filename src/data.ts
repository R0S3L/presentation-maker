// src/data.ts
import type { Presentation } from './types/presentation';
import { createPresentation } from './functions/presentationFunc';
import type { Slide } from './types/slide';
import { addTextObject } from './functions/objectsFunc';
import { addSlide, setSlideBackgroundColor } from './functions/slideFunc';

function updateSlide(presentation: Presentation, updatedSlide: Slide): Presentation {
  return {
    ...presentation,
    slides: presentation.slides.map(slide =>
      slide.id === updatedSlide.id ? updatedSlide : slide
    )
  };
}

function createTestPresentation(): Presentation {
  let presentation = createPresentation('Тестовая презентация');

  // Первый слайд -- заголовок
  let slide1 = presentation.slides[0];
  slide1 = setSlideBackgroundColor(slide1, '#f0f0f0');
  slide1 = addTextObject(slide1, 'Добро пожаловать!', 50, 50, 400, 60, 'Arial', 32, '#333333');
  slide1 = addTextObject(slide1, 'Лабораторная работа #2', 50, 120, 400, 40, 'Arial', 20, '#666666');
  presentation = updateSlide(presentation, slide1);

  // Второй слайд
  presentation = addSlide(presentation, 'Список');
  let slide2 = presentation.slides[1];
  slide2 = setSlideBackgroundColor(slide2, '#ffffff');
  slide2 = addTextObject(slide2, 'Список задач:', 50, 50, 300, 40, 'Arial', 24, '#000000');
  slide2 = addTextObject(slide2, '1. Разработать интерфейс', 50, 100, 300, 30, 'Arial', 18, '#333333');
  slide2 = addTextObject(slide2, '2. Добавить интерактивность', 50, 140, 300, 30, 'Arial', 18, '#333333');
  slide2 = addTextObject(slide2, '3. Выделить общие компоненты', 50, 180, 300, 30, 'Arial', 18, '#333333');
  presentation = updateSlide(presentation, slide2);

  // Третий слайд
  presentation = addSlide(presentation, 'Итоги');
  let slide3 = presentation.slides[2];
  slide3 = setSlideBackgroundColor(slide3, '#e8f5e9');
  slide3 = addTextObject(slide3, 'Итоги работы:', 50, 50, 300, 40, 'Arial', 24, '#2e7d32');
  slide3 = addTextObject(slide3, 'Готово!', 50, 120, 200, 60, 'Arial', 36, '#4caf50');
  presentation = updateSlide(presentation, slide3);

  return presentation;
}

export {
  createTestPresentation,
};
