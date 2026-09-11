import { Slide } from '../types/slide';
import { TextObject, ImageObject } from '../types/objects';
import { generateId } from '../index.js';

function addTextObject(slide: Slide, content: string, x: number, y: number, width: number, height: number, fontFamily: string, fontSize: number, fontColor: string): Slide {
    const newObject: TextObject = {
        id: generateId(),
        name: 'Текст',
        content,
        x_coord: x,
        y_coord: y,
        width,
        height,
        fontFamily,
        fontSize,
        contentColor: fontColor
    };

    return {
        ...slide,
        objects: [
            ...slide.objects,
            newObject
        ]
    };
}

function addImageObject(slide: Slide, imageUrl: string, x: number, y: number, width: number, height: number): Slide {
    const newObject: ImageObject = {
        id: generateId(),
        type: 'image',
        path: imageUrl,
        x_coord: x,
        y_coord: y,
        width,
        height
    };

    return {
        ...slide,
        objects: [
            ...slide.objects,
            newObject
        ]
    };
}

function removeObject(slide: Slide, objectId: string): Slide {
    return {
        ...slide,
        objects: slide.objects.filter( object => object.id !== objectId)
    };
}

function moveObject(slide: Slide, objectId: string, newX: number, newY: number): Slide {
    return {
        ...slide,
        objects: slide.objects.map(object => {
            if (object.id !== objectId) {
                return object;
            }

            return {
                ...object,
                x_coord: newX,
                y_coord: newY
            };
        })
    };
}

function resizeObject(slide: Slide,objectId: string,newWidth: number,newHeight: number): Slide {
    return {
        ...slide,
        objects: slide.objects.map(object => {
            if (object.id !== objectId) {
                return object;
            }

            return {
                ...object,
                width: newWidth,
                height: newHeight
            };
        })
    };
}

function updateTextObjectStyle(slide: Slide,objectId: string,fontFamily: string,fontSize: number,fontColor: string): Slide {
    return {
        ...slide,
        objects: slide.objects.map(object => {
            if (object.id !== objectId) {
                return object;
            }

            if ('type' in object && object.type === 'image') {
                return object;
            }

            return {
                ...object,
                fontFamily,
                fontSize,
                contentColor: fontColor
            };
        })
    };
}

export { addTextObject, addImageObject, removeObject, moveObject, resizeObject, updateTextObjectStyle };