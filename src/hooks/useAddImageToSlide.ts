import { useCallback } from 'react';
import type { Slide } from '../types/slide';
import { dispatch } from '../editor';
import { addImageObject } from '../functions/objectsFunc';
import { updateSlide } from '../functions/slideFunc';

function useAddImageToSlide(slide: Slide | undefined) {
	const slideId = slide?.id;

	const addImage = useCallback((file: File) => {
		if (!slideId) return;

		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result !== 'string') {
				console.error('Failed to read image file as a data URL.', reader.error);
				return;
			}

			dispatch(presentation => updateSlide(
				presentation,
				slideId,
				currentSlide => addImageObject(currentSlide, reader.result as string, 200, 150, 300, 200),
			));
		};
		reader.onerror = () => {
			console.error('Failed to read image file.', reader.error);
		};
		reader.readAsDataURL(file);
	}, [slideId]);

	return addImage;
}

export { useAddImageToSlide };
