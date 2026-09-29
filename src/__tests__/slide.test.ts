import { describe, expect, test } from 'vitest';
import {
    removeSlides,
    moveSlide,
    setSlideBackgroundColor,
    clearSlideBackground,
} from '../index';
import type { Presentation, Slide } from '../index';

function makeSlide(id: string): Slide {
    return {
        id,
        name: `Slide ${id}`,
        background: { type: 'none' },
        objects: [],
    };
}

function makePresentation(ids: string[], activeSlideId: string = ids[0]): Presentation {
    return {
        id: 'presentation-id',
        name: 'test',
        slides: ids.map(makeSlide),
        activeSlideId,
    };
}

const ids = (presentation: Presentation): string[] => presentation.slides.map(slide => slide.id);

describe('removeSlides', () => {
    test('удаляет один слайд', () => {
        const presentation = makePresentation(['a', 'b', 'c']);

        const result = removeSlides(presentation, ['b']);

        expect(ids(result)).toEqual(['a', 'c']);
    });

    test('удаляет несколько слайдов', () => {
        const presentation = makePresentation(['a', 'b', 'c', 'd']);

        const result = removeSlides(presentation, ['a', 'c']);

        expect(ids(result)).toEqual(['b', 'd']);
    });

    test('если удалён активный слайд, активным становится первый из оставшихся', () => {
        const presentation = makePresentation(['a', 'b', 'c'], 'b');

        const result = removeSlides(presentation, ['b']);

        expect(result.activeSlideId).toBe('a');
    });

    test('если активный слайд не удалён, он остаётся активным', () => {
        const presentation = makePresentation(['a', 'b', 'c'], 'c');

        const result = removeSlides(presentation, ['a']);

        expect(result.activeSlideId).toBe('c');
    });

    test('при удалении всех слайдов список пуст, activeSlideId пустой', () => {
        const presentation = makePresentation(['a', 'b']);

        const result = removeSlides(presentation, ['a', 'b']);

        expect(result.slides).toEqual([]);
        expect(result.activeSlideId).toBe('');
    });

    test('не мутирует исходную презентацию', () => {
        const presentation = makePresentation(['a', 'b', 'c']);

        removeSlides(presentation, ['b']);

        expect(ids(presentation)).toEqual(['a', 'b', 'c']);
    });
});

describe('moveSlide', () => {
    test('перемещает слайд в начало', () => {
        const presentation = makePresentation(['a', 'b', 'c', 'd']);

        const result = moveSlide(presentation, 'c', 0);

        expect(ids(result)).toEqual(['c', 'a', 'b', 'd']);
    });

    test('перемещает слайд в конец', () => {
        const presentation = makePresentation(['a', 'b', 'c', 'd']);

        const result = moveSlide(presentation, 'a', 3);

        expect(ids(result)).toEqual(['b', 'c', 'd', 'a']);
    });

    test('перемещает слайд в середину', () => {
        const presentation = makePresentation(['a', 'b', 'c', 'd']);

        const result = moveSlide(presentation, 'a', 2);

        expect(ids(result)).toEqual(['b', 'c', 'a', 'd']);
    });

    test('индекс за пределами массива ограничивается краями', () => {
        const presentation = makePresentation(['a', 'b', 'c']);

        expect(ids(moveSlide(presentation, 'a', 100))).toEqual(['b', 'c', 'a']);
        expect(ids(moveSlide(presentation, 'c', -5))).toEqual(['c', 'a', 'b']);
    });

    test('несуществующий слайд — презентация не меняется', () => {
        const presentation = makePresentation(['a', 'b', 'c']);

        const result = moveSlide(presentation, 'unknown', 1);

        expect(result).toBe(presentation);
    });
});

describe('setSlideBackgroundColor', () => {
    test('устанавливает цвет фона', () => {
        const slide = makeSlide('a');

        const result = setSlideBackgroundColor(slide, '#ff0000');

        expect(result.background).toEqual({ type: 'color', color: '#ff0000' });
    });

    test('заменяет прежний фон и не мутирует исходный слайд', () => {
        const slide: Slide = {
            ...makeSlide('a'),
            background: { type: 'image', imageUrl: 'bg.png' },
        };

        const result = setSlideBackgroundColor(slide, '#00ff00');

        expect(result.background).toEqual({ type: 'color', color: '#00ff00' });
        expect(slide.background).toEqual({ type: 'image', imageUrl: 'bg.png' });
    });
});

describe('clearSlideBackground', () => {
    test('сбрасывает фон', () => {
        const slide: Slide = {
            ...makeSlide('a'),
            background: { type: 'color', color: '#ff0000' },
        };

        const result = clearSlideBackground(slide);

        expect(result.background).toEqual({ type: 'none' });
    });

    test('остальные поля слайда не меняются', () => {
        const slide: Slide = {
            ...makeSlide('a'),
            background: { type: 'color', color: '#ff0000' },
        };

        const result = clearSlideBackground(slide);

        expect(result.id).toBe(slide.id);
        expect(result.name).toBe(slide.name);
        expect(result.objects).toEqual(slide.objects);
    });
});