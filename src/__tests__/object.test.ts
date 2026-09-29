import { describe, expect, test } from 'vitest';
import {
    addTextObject,
    addImageObject,
    removeObject,
    moveObject,
    resizeObject,
    updateTextObjectStyle,
} from '../index';
import type { Slide, TextObject, ImageObject } from '../index';

const textObject: TextObject = {
    id: 'text-1',
    name: 'Текст',
    content: 'Привет',
    x_coord: 10,
    y_coord: 20,
    width: 100,
    height: 50,
    fontFamily: 'Arial',
    fontSize: 16,
    contentColor: '#000000',
};

const imageObject: ImageObject = {
    id: 'image-1',
    type: 'image',
    path: 'image.png',
    x_coord: 30,
    y_coord: 40,
    width: 200,
    height: 150,
};

function makeSlide(objects: Slide['objects'] = []): Slide {
    return {
        id: 'slide-1',
        name: 'Slide',
        background: { type: 'none' },
        objects,
    };
}

describe('addTextObject', () => {
    test('добавляет текстовый объект с переданными параметрами', () => {
        const slide = makeSlide();

        const result = addTextObject(slide, 'Hello', 5, 6, 300, 80, 'Roboto', 24, '#ff0000');

        expect(result.objects).toHaveLength(1);

        const added = result.objects[0] as TextObject;
        expect(typeof added.id).toBe('string');
        expect(added.id).not.toBe('');
        expect(added).toEqual({
            id: added.id,
            name: 'Текст',
            content: 'Hello',
            x_coord: 5,
            y_coord: 6,
            width: 300,
            height: 80,
            fontFamily: 'Roboto',
            fontSize: 24,
            contentColor: '#ff0000',
        });
    });

    test('сохраняет существующие объекты и не мутирует исходный слайд', () => {
        const slide = makeSlide([imageObject]);

        const result = addTextObject(slide, 'Hello', 0, 0, 10, 10, 'Arial', 12, '#000');

        expect(result.objects).toHaveLength(2);
        expect(result.objects[0]).toEqual(imageObject);
        expect(slide.objects).toHaveLength(1);
    });
});

describe('addImageObject', () => {
    test('добавляет изображение с переданными параметрами', () => {
        const slide = makeSlide();

        const result = addImageObject(slide, 'photo.jpg', 1, 2, 640, 480);

        expect(result.objects).toHaveLength(1);

        const added = result.objects[0] as ImageObject;
        expect(typeof added.id).toBe('string');
        expect(added.id).not.toBe('');
        expect(added).toEqual({
            id: added.id,
            type: 'image',
            path: 'photo.jpg',
            x_coord: 1,
            y_coord: 2,
            width: 640,
            height: 480,
        });
    });

    test('не мутирует исходный слайд', () => {
        const slide = makeSlide();

        addImageObject(slide, 'photo.jpg', 0, 0, 10, 10);

        expect(slide.objects).toEqual([]);
    });
});

describe('moveObject', () => {
    test('перемещает объект на новые координаты', () => {
        const slide = makeSlide([textObject, imageObject]);

        const result = moveObject(slide, 'text-1', 111, 222);

        expect(result.objects[0]).toEqual({ ...textObject, x_coord: 111, y_coord: 222 });
    });

    test('остальные объекты не меняются', () => {
        const slide = makeSlide([textObject, imageObject]);

        const result = moveObject(slide, 'text-1', 111, 222);

        expect(result.objects[1]).toEqual(imageObject);
    });

    test('несуществующий id — объекты не меняются', () => {
        const slide = makeSlide([textObject, imageObject]);

        const result = moveObject(slide, 'unknown', 1, 1);

        expect(result.objects).toEqual([textObject, imageObject]);
    });
});

describe('resizeObject', () => {
    test('изменяет размер объекта', () => {
        const slide = makeSlide([textObject, imageObject]);

        const result = resizeObject(slide, 'image-1', 400, 300);

        expect(result.objects[1]).toEqual({ ...imageObject, width: 400, height: 300 });
    });

    test('координаты и остальные объекты не меняются', () => {
        const slide = makeSlide([textObject, imageObject]);

        const result = resizeObject(slide, 'image-1', 400, 300);
        const resized = result.objects[1] as ImageObject;

        expect(resized.x_coord).toBe(imageObject.x_coord);
        expect(resized.y_coord).toBe(imageObject.y_coord);
        expect(result.objects[0]).toEqual(textObject);
    });
});

describe('updateTextObjectStyle', () => {
    test('изменяет шрифт, размер и цвет текстового объекта', () => {
        const slide = makeSlide([textObject]);

        const result = updateTextObjectStyle(slide, 'text-1', 'Times New Roman', 32, '#00ff00');

        expect(result.objects[0]).toEqual({
            ...textObject,
            fontFamily: 'Times New Roman',
            fontSize: 32,
            contentColor: '#00ff00',
        });
    });

    test('изображение остаётся без изменений', () => {
        const slide = makeSlide([textObject, imageObject]);

        const result = updateTextObjectStyle(slide, 'image-1', 'Times New Roman', 32, '#00ff00');

        expect(result.objects[1]).toEqual(imageObject);
    });

    test('не мутирует исходный слайд', () => {
        const slide = makeSlide([textObject]);

        updateTextObjectStyle(slide, 'text-1', 'Times New Roman', 32, '#00ff00');

        expect(slide.objects[0]).toEqual(textObject);
    });
});

describe('removeObject', () => {
    test('удаляет объект по id', () => {
        const slide = makeSlide([textObject, imageObject]);

        const result = removeObject(slide, 'text-1');

        expect(result.objects).toEqual([imageObject]);
    });

    test('несуществующий id — объекты не меняются', () => {
        const slide = makeSlide([textObject, imageObject]);

        const result = removeObject(slide, 'unknown');

        expect(result.objects).toEqual([textObject, imageObject]);
    });

    test('не мутирует исходный слайд', () => {
        const slide = makeSlide([textObject, imageObject]);

        removeObject(slide, 'text-1');

        expect(slide.objects).toHaveLength(2);
    });
});