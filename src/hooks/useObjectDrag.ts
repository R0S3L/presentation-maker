import { useEffect, useRef } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import type { SlideObject } from '../types/objects';
import type { Slide } from '../types/slide';
import { beginHistoryTransaction, dispatch, endHistoryTransaction } from '../editor';
import { moveObject } from '../functions/objectsFunc';
import { updateSlide } from '../functions/slideFunc';

type DragPosition = Pick<SlideObject, 'id' | 'x_coord' | 'y_coord'>;

type DragState = {
	slideId: string;
	startX: number;
	startY: number;
	canvasWidth: number;
	canvasHeight: number;
	positions: DragPosition[];
	moved: boolean;
};

function useObjectDrag(slide: Slide | undefined, selectedObjectIds: string[]) {
	const dragRef = useRef<DragState | null>(null);
	const cleanupRef = useRef<(() => void) | null>(null);
	const ignoreNextClickRef = useRef(false);

	useEffect(() => () => {
		const drag = dragRef.current;
		cleanupRef.current?.();
		if (drag) {
			dragRef.current = null;
			endHistoryTransaction();
		}
	}, [slide?.id]);

	function startDrag(event: ReactMouseEvent<HTMLDivElement>, objectId: string) {
		if (!slide || event.button !== 0 || !selectedObjectIds.includes(objectId)) return;

		const canvas = event.currentTarget.parentElement;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const positions = slide.objects
			.filter(object => selectedObjectIds.includes(object.id))
			.map(({ id, x_coord, y_coord }) => ({ id, x_coord, y_coord }));

		if (positions.length === 0 || rect.width === 0 || rect.height === 0) return;

		event.preventDefault();
		beginHistoryTransaction();
		dragRef.current = {
			slideId: slide.id,
			startX: event.clientX,
			startY: event.clientY,
			canvasWidth: rect.width,
			canvasHeight: rect.height,
			positions,
			moved: false,
		};

		function handleMouseMove(mouseEvent: globalThis.MouseEvent) {
			const drag = dragRef.current;
			if (!drag) return;

			const deltaX = (mouseEvent.clientX - drag.startX) * (640 / drag.canvasWidth);
			const deltaY = (mouseEvent.clientY - drag.startY) * (360 / drag.canvasHeight);

			if (deltaX === 0 && deltaY === 0) return;
			drag.moved = true;

			dispatch(presentation => updateSlide(
				presentation,
				drag.slideId,
				currentSlide => drag.positions.reduce(
					(updatedSlide, position) => moveObject(
						updatedSlide,
						position.id,
						position.x_coord + deltaX,
						position.y_coord + deltaY,
					),
					currentSlide,
				),
			));
		}

		function cleanup() {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
			if (cleanupRef.current === cleanup) cleanupRef.current = null;
		}

		function handleMouseUp() {
			const drag = dragRef.current;
			if (drag?.moved) {
				ignoreNextClickRef.current = true;
				window.setTimeout(() => {
					ignoreNextClickRef.current = false;
				}, 0);
			}
			dragRef.current = null;
			endHistoryTransaction();
			cleanup();
		}

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		cleanupRef.current = cleanup;
	}

	function shouldIgnoreClick() {
		if (!ignoreNextClickRef.current) return false;
		ignoreNextClickRef.current = false;
		return true;
	}

	return { startDrag, shouldIgnoreClick };
}

export { useObjectDrag };
