import { useEffect, useRef } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import type { SlideObject } from '../types/objects';
import type { Slide } from '../types/slide';
import { dispatch } from '../editor';
import { resizeObject } from '../functions/objectsFunc';
import { updateSlide } from '../functions/slideFunc';

type ResizeState = {
	slideId: string;
	objectId: string;
	startX: number;
	startY: number;
	startWidth: number;
	startHeight: number;
	canvasWidth: number;
	canvasHeight: number;
};

function useObjectResize(slide: Slide | undefined) {
	const resizeRef = useRef<ResizeState | null>(null);
	const cleanupRef = useRef<(() => void) | null>(null);

	useEffect(() => () => {
		cleanupRef.current?.();
	}, [slide?.id]);

	function startResize(event: ReactMouseEvent<HTMLDivElement>, object: SlideObject) {
		if (!slide || event.button !== 0) return;

		const canvas = event.currentTarget.parentElement?.parentElement;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		if (rect.width === 0 || rect.height === 0) return;

		event.preventDefault();
		event.stopPropagation();
		resizeRef.current = {
			slideId: slide.id,
			objectId: object.id,
			startX: event.clientX,
			startY: event.clientY,
			startWidth: object.width,
			startHeight: object.height,
			canvasWidth: rect.width,
			canvasHeight: rect.height,
		};

		function handleMouseMove(mouseEvent: globalThis.MouseEvent) {
			const resize = resizeRef.current;
			if (!resize) return;

			const deltaX = (mouseEvent.clientX - resize.startX) * (640 / resize.canvasWidth);
			const deltaY = (mouseEvent.clientY - resize.startY) * (360 / resize.canvasHeight);
			const width = Math.max(30, resize.startWidth + deltaX);
			const height = Math.max(30, resize.startHeight + deltaY);

			dispatch(presentation => updateSlide(
				presentation,
				resize.slideId,
				currentSlide => resizeObject(currentSlide, resize.objectId, width, height),
			));
		}

		function cleanup() {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
			if (cleanupRef.current === cleanup) cleanupRef.current = null;
		}

		function handleMouseUp() {
			resizeRef.current = null;
			cleanup();
		}

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		cleanupRef.current = cleanup;
	}

	return { startResize };
}

export { useObjectResize };
