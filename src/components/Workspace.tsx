import { useEffect, useState } from 'react';
import type { Presentation } from '../types/presentation';
import { dispatch } from '../editor';
import { removeObject } from '../functions/objectsFunc';
import { SlidePreview } from './SlidePreview';
import { SlideProperties } from './SlideProperties';
import { updateSlide } from '../functions/slideFunc';
import styles from './Workspace.module.css';

type WorkspaceProps = { presentation: Presentation };

function Workspace({ presentation }: WorkspaceProps) {
	const [selectedObjectIds, setSelectedObjectIds] = useState<string[]>([]);
	const slide = presentation.slides.find(item => item.id === presentation.activeSlideId);

	useEffect(() => {
		setSelectedObjectIds([]);
	}, [presentation.activeSlideId]);

	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key !== 'Delete' && event.key !== 'Backspace') return;
			if (selectedObjectIds.length === 0) return;

			const target = event.target;
			if (
				target instanceof HTMLElement
				&& (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
			) {
				return;
			}

			event.preventDefault();
			dispatch(currentPresentation => selectedObjectIds.reduce(
				(updatedPresentation, objectId) => updateSlide(
					updatedPresentation,
					presentation.activeSlideId,
					currentSlide => removeObject(currentSlide, objectId),
				),
				currentPresentation,
			));
			setSelectedObjectIds([]);
		}

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [presentation.activeSlideId, selectedObjectIds]);

	function selectObject(objectId: string, shiftKey: boolean) {
		setSelectedObjectIds(currentSelection => {
			if (!shiftKey) return [objectId];

			return currentSelection.includes(objectId)
				? currentSelection.filter(id => id !== objectId)
				: [...currentSelection, objectId];
		});
	}

	if (!slide) {
		return <section className={`${styles.workspace} ${styles.empty}`}><p>Создайте слайд, чтобы начать работу</p></section>;
	}

	return (
		<section className={styles.workspace}>
			<div className={styles.canvasArea}>
				<div className={styles.canvasMeta}><span>СЛАЙД</span><strong>{slide.name}</strong></div>
				<SlidePreview
					slide={slide}
					selectedObjectIds={selectedObjectIds}
					onObjectClick={selectObject}
					onCanvasClick={() => setSelectedObjectIds([])}
					onDeleteObject={objectId => dispatch(presentation => updateSlide(
						presentation, slide.id, current => removeObject(current, objectId),
					))}
				/>
			</div>
			<SlideProperties slide={slide} />
		</section>
	);
}

export { Workspace };
