import { useEffect, useState } from 'react';
import type { Presentation } from '../types/presentation';

function usePreviewNavigation(presentation: Presentation, onClose: () => void, enabled: boolean) {
	const [slideIndex, setSlideIndex] = useState(() => Math.max(
		presentation.slides.findIndex(slide => slide.id === presentation.activeSlideId), 0,
	));

	useEffect(() => {
		if (!enabled) return;

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') onClose();
			if (event.key === 'ArrowLeft') setSlideIndex(index => Math.max(index - 1, 0));
			if (event.key === 'ArrowRight') {
				setSlideIndex(index => Math.min(index + 1, presentation.slides.length - 1));
			}
		}

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [enabled, onClose, presentation.slides.length]);

	return {
		slideIndex,
		goToPrevious: () => setSlideIndex(index => Math.max(index - 1, 0)),
		goToNext: () => setSlideIndex(index => Math.min(index + 1, presentation.slides.length - 1)),
	};
}

export { usePreviewNavigation };
