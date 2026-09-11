import { generateId } from '../index.js';
function addTextObject(slide, content, x, y, width, height, fontFamily, fontSize, fontColor) {
    const newObject = {
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
function addImageObject(slide, imageUrl, x, y, width, height) {
    const newObject = {
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
function removeObject(slide, objectId) {
    return {
        ...slide,
        objects: slide.objects.filter(object => object.id !== objectId)
    };
}
function moveObject(slide, objectId, newX, newY) {
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
function resizeObject(slide, objectId, newWidth, newHeight) {
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
function updateTextObjectStyle(slide, objectId, fontFamily, fontSize, fontColor) {
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
