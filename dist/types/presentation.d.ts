import { Slide } from '../types/slide';
type Presentation = {
    id: string;
    name: string;
    activeSlideId: string;
    slides: Slide[];
};
export { Presentation };
