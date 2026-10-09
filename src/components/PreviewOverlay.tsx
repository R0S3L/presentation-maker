import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Presentation } from '../types/presentation';
import { Button } from './Button';
import { SlidePreview } from './SlidePreview';

type PreviewOverlayProps = { presentation: Presentation; onClose: () => void };

function PreviewOverlay({ presentation, onClose }: PreviewOverlayProps) {
	const [slideIndex, setSlideIndex] = useState(() => Math.max(
		presentation.slides.findIndex(slide => slide.id === presentation.activeSlideId), 0,
	));
	const slide = presentation.slides[slideIndex];
	const overlayRoot = document.getElementById('overlay');

	if (!overlayRoot) return null;

	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') onClose();
			if (event.key === 'ArrowLeft') setSlideIndex(index => Math.max(index - 1, 0));
			if (event.key === 'ArrowRight') setSlideIndex(index => Math.min(index + 1, presentation.slides.length - 1));
		}
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [onClose, presentation.slides.length]);

	if (!slide) {
		return createPortal(
			<div className="preview-overlay"><Button text="Закрыть" onClick={onClose} /><p>В презентации пока нет слайдов</p></div>,
			overlayRoot,
		);
	}

	return createPortal(
		<div className="preview-overlay">
			<div className="preview-topbar"><span>{presentation.name}</span><Button text="Закрыть" className="preview-close" onClick={onClose} /></div>
			<div className="preview-stage">
				<Button text="Назад" className="preview-nav" onClick={() => setSlideIndex(index => Math.max(index - 1, 0))} disabled={slideIndex === 0} />
				<div className="preview-slide"><SlidePreview slide={slide} /></div>
				<Button text="Далее" className="preview-nav" onClick={() => setSlideIndex(index => Math.min(index + 1, presentation.slides.length - 1))} disabled={slideIndex === presentation.slides.length - 1} />
			</div>
			<div className="preview-counter">{String(slideIndex + 1).padStart(2, '0')} / {String(presentation.slides.length).padStart(2, '0')}</div>
		</div>,
		overlayRoot,
	);
}

export { PreviewOverlay };
