type SlideObject = TextObject | ImageObject;
type TextObject = {
    id: string;
    name: string;
    content: string;
    x_coord: number;
    y_coord: number;
    width: number;
    height: number;
    fontFamily: string;
    fontSize: number;
    contentColor: string;
};
type ImageObject = {
    id: string;
    type: 'image';
    path: string;
    x_coord: number;
    y_coord: number;
    width: number;
    height: number;
};
export { SlideObject, TextObject, ImageObject };
