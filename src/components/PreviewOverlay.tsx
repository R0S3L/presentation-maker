import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Presentation } from '../types/presentation';
import { Button } from './Button';
import { SlidePreview } from './SlidePreview';
import styles from './PreviewOverlay.module.css';

type PreviewOverlayProps = { presentation: Presentation; onClose: () => void };

function PreviewOverlay({ presentation, onClose }: PreviewOverlayProps) {
	const [slideIndex, setSlideIndex] = useState(() => Math.max(
		presentation.slides.findIndex(slide => slide.id === presentation.activeSlideId), 0,
	));
	const slide = presentation.slides[slideIndex];
	const overlayRoot = document.getElementById('overlay');

	useEffect(() => {
		if (!overlayRoot) return;

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') onClose();
			if (event.key === 'ArrowLeft') setSlideIndex(index => Math.max(index - 1, 0));
			if (event.key === 'ArrowRight') setSlideIndex(index => Math.min(index + 1, presentation.slides.length - 1));
		}
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [onClose, overlayRoot, presentation.slides.length]);

	if (!overlayRoot) return null;

	if (!slide) {
		return createPortal(
			<div className={styles.overlay}><Button text="Закрыть" onClick={onClose} /><p>В презентации пока нет слайдов</p></div>,
			overlayRoot,
		);
	}

	return createPortal(
		<div className={styles.overlay}>
			<div className={styles.topBar}><span>{presentation.name}</span><Button text="Закрыть" variant="previewClose" onClick={onClose} /></div>
			<div className={styles.stage}>
				<Button text="Назад" variant="previewNav" onClick={() => setSlideIndex(index => Math.max(index - 1, 0))} disabled={slideIndex === 0} />
				<div className={styles.slide}><SlidePreview slide={slide} variant="presentation" /></div>
				<Button text="Далее" variant="previewNav" onClick={() => setSlideIndex(index => Math.min(index + 1, presentation.slides.length - 1))} disabled={slideIndex === presentation.slides.length - 1} />
			</div>
			<div className={styles.counter}>{String(slideIndex + 1).padStart(2, '0')} / {String(presentation.slides.length).padStart(2, '0')}</div>
		</div>,
		overlayRoot,
	);
}

export { PreviewOverlay };
