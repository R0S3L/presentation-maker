type SlideObject= TextObject | ImageObject;

type TextObject={
id: string;
name: string;
content: string; //текст
x_coord: number; 
y_coord: number; 
width: number; 
height: number; 
fontFamily: string; //шрифт
fontSize: number; //размер шрифта
contentColor: string; //цвет текста
}

type ImageObject={
id: string;
type: 'image';
path: string; //путь к фото
x_coord: number; 
y_coord: number;
width: number; 
height: number; 
}

export {SlideObject, TextObject, ImageObject};