import { describe, expect, test } from 'vitest';

import {createPresentation,updatePresentationName,savePresentation,loadPresentation} from '../functions/presentationFunc.js';

import { addSlide } from '../functions/slideFunc.js';

describe('Presentation', () => {

    test('createPresentation — создание презентации со значениями по умолчанию', () => {
        const presentation = createPresentation('test');

        expect(presentation.id).toBeDefined();
        expect(typeof presentation.id).toBe('string');
        expect(presentation.name).toBe('test');

        expect(presentation.slides).toHaveLength(1);
        const titleSlide = presentation.slides[0];

        expect(typeof titleSlide.id).toBe('string');
        expect(presentation.activeSlideId).toBe(titleSlide.id);
        expect(titleSlide).toEqual({
            id: titleSlide.id,
            name: 'Title',
            background: { type: 'none' },
            objects: [],
        });
    });
    test('createPresentation — исходные данные отсутствуют и не изменяются', () => {
        const presentation = createPresentation('Новая презентация');

        const copy = {
            ...presentation,
            slides: [...presentation.slides]
        };

        const result = createPresentation('Новая презентация');

        expect(presentation).toEqual(copy);
        expect(result).not.toBe(presentation);
    });

    test('updatePresentationName — изменение названия', () => {
        const presentation = createPresentation('Старая презентация');
        const original = structuredClone(presentation);

        const result = updatePresentationName(
            presentation,
            'Новая презентация'
        );

        expect(result.name).toBe('Новая презентация');
        expect(result.id).toBe(presentation.id);
        expect(result.slides).toEqual(presentation.slides);

        expect(presentation).toEqual(original);
        expect(result).not.toBe(presentation);
    });

    test('savePresentation / loadPresentation — сериализация и десериализация', () => {
        const presentation = createPresentation('Моя презентация');

        const withSlide = addSlide(
            presentation,
            'Первый слайд'
        );

        const original = structuredClone(withSlide);

        const saved = savePresentation(withSlide);

        expect(typeof saved).toBe('string');
        expect(saved).toBe(JSON.stringify(withSlide));

        const loaded = loadPresentation(saved);

        expect(loaded).toEqual(withSlide);
        expect(loaded).not.toBe(withSlide);

        expect(withSlide).toEqual(original);
    });

    test('addSlide — добавление первого слайда и его активация', () => {
        const presentation = createPresentation('test');
        const original = structuredClone(presentation);

        const result = addSlide(
            presentation,
            'Первый слайд'
        );

        expect(result.slides).toHaveLength(2);
        expect(result.slides[1].name).toBe('Первый слайд');

        expect(result.activeSlideId).toBe(
            result.slides[1].id
        );

        expect(result.slides[0].objects).toEqual([]);
        expect(result.slides[0].background).toEqual({
            type: 'none'
        });

        expect(presentation).toEqual(original);
        expect(result).not.toBe(presentation);
        expect(result.slides).not.toBe(presentation.slides);
    });  
});