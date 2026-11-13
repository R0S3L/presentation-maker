import { createPortal } from 'react-dom';
import type { Presentation } from '../types/presentation';
import { usePreviewNavigation } from '../hooks/usePreviewNavigation';
import { Button } from './Button';
import { SlidePreview } from './SlidePreview';
import styles from './PreviewOverlay.module.css';

type PreviewOverlayProps = { presentation: Presentation; onClose: () => void };

function PreviewOverlay({ presentation, onClose }: PreviewOverlayProps) {
	const overlayRoot = document.getElementById('overlay');
	const { slideIndex, goToPrevious, goToNext } = usePreviewNavigation(
		presentation,
		onClose,
		Boolean(overlayRoot),
	);
	const slide = presentation.slides[slideIndex];

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
				<Button text="Назад" variant="previewNav" onClick={goToPrevious} disabled={slideIndex === 0} />
				<div className={styles.slide}><SlidePreview slide={slide} variant="presentation" /></div>
				<Button text="Далее" variant="previewNav" onClick={goToNext} disabled={slideIndex === presentation.slides.length - 1} />
			</div>
			<div className={styles.counter}>{String(slideIndex + 1).padStart(2, '0')} / {String(presentation.slides.length).padStart(2, '0')}</div>
		</div>,
		overlayRoot,
	);
}

export { PreviewOverlay };
