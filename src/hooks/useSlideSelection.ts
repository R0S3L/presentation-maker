import { useEffect, useState } from 'react';
import { dispatch } from '../editor';
import { removeObject } from '../functions/objectsFunc';
import { updateSlide } from '../functions/slideFunc';

function useSlideSelection(activeSlideId: string) {
	const [selectedObjectIds, setSelectedObjectIds] = useState<string[]>([]);

	useEffect(() => {
		setSelectedObjectIds([]);
	}, [activeSlideId]);

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
			dispatch(presentation => selectedObjectIds.reduce(
				(updatedPresentation, objectId) => updateSlide(
					updatedPresentation,
					activeSlideId,
					slide => removeObject(slide, objectId),
				),
				presentation,
			));
			setSelectedObjectIds([]);
		}

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [activeSlideId, selectedObjectIds]);

	function selectObject(objectId: string, shiftKey: boolean) {
		setSelectedObjectIds(currentSelection => {
			if (!shiftKey) return [objectId];

			return currentSelection.includes(objectId)
				? currentSelection.filter(id => id !== objectId)
				: [...currentSelection, objectId];
		});
	}

	return {
		selectedObjectIds,
		selectObject,
		clearSelection: () => setSelectedObjectIds([]),
	};
}

export { useSlideSelection };
