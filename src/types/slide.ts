import { SlideObject } from "./objects";

type Slide={ 
id: string; 
name: string;
background: Background;
objects: SlideObject[];
} 

type Background=
 { type: 'none'} 
 | { type: 'color'; color: string } 
 | {type: 'image'; imageUrl: string } ;

export {Slide, Background };