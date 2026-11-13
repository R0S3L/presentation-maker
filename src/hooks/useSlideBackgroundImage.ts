import { useCallback } from 'react';
import { dispatch } from '../editor';
import { setSlideBackgroundImage, updateSlide } from '../functions/slideFunc';
import type { Slide } from '../types/slide';

function useSlideBackgroundImage(slide: Slide) {
	const slideId = slide.id;

	return useCallback((file: File) => {
		if (!file.type.startsWith('image/')) {
			console.error('Unsupported background file type.', file.type);
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result !== 'string') {
				console.error('Failed to read background image as a data URL.', reader.error);
				return;
			}

			dispatch(presentation => updateSlide(
				presentation,
				slideId,
				currentSlide => setSlideBackgroundImage(currentSlide, reader.result as string),
			));
		};
		reader.onerror = () => {
			console.error('Failed to read background image file.', reader.error);
		};
		reader.readAsDataURL(file);
	}, [slideId]);
}

export { useSlideBackgroundImage };
