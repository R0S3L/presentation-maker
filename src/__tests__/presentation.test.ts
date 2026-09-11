import { describe, expect, test } from 'vitest';

import {createPresentation,updatePresentationName,savePresentation,loadPresentation} from '../functions/presentationFunc.js';

import { addSlide } from '../functions/slideFunc.js';

describe('Presentation', () => {

    test('createPresentation — создание презентации со значениями по умолчанию', () => {
        const presentation = createPresentation('test');

        expect(presentation.id).toBeDefined();
        expect(typeof presentation.id).toBe('string');

        expect(presentation.name).toBe('Новая презентация');
        expect(presentation.activeSlideId).toBe('');
        expect(presentation.slides).toEqual([]);
    });

    test('createPresentation — исходные данные отсутствуют и не изменяются', () => {
        const presentation = createPresentation('test');

        const copy = {
            ...presentation,
            slides: [...presentation.slides]
        };

        const result = createPresentation('test');

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

        expect(result.slides).toHaveLength(1);
        expect(result.slides[0].name).toBe('Первый слайд');

        expect(result.activeSlideId).toBe(
            result.slides[0].id
        );

        expect(result.slides[0].objects).toEqual([]);
        expect(result.slides[0].background).toEqual({
            type: 'none'
        });

        expect(presentation).toEqual(original);
        expect(result).not.toBe(presentation);
        expect(result.slides).not.toBe(presentation.slides);
    });

    test('addSlide — второй слайд не меняет активный первый', () => {
        const presentation = createPresentation('test');

        const first = addSlide(
            presentation,
            'Первый'
        );

        const original = structuredClone(first);

        const second = addSlide(
            first,
            'Второй'
        );

        expect(second.slides).toHaveLength(2);

        expect(second.activeSlideId).toBe(
            first.activeSlideId
        );

        expect(second.slides[1].name).toBe('Второй');

        expect(first).toEqual(original);
        expect(second).not.toBe(first);
        expect(second.slides).not.toBe(first.slides);
    });
});