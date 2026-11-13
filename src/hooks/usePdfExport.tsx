import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import type { Presentation } from '../types/presentation';
import { SlidePreview } from '../components/SlidePreview';

const pageWidth = 320;
const pageHeight = 180;
const renderWidth = 1280;
const renderHeight = 720;

function usePdfExport() {
	const [isExporting, setIsExporting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const mountedRef = useRef(false);
	const exportRootRef = useRef<Root | null>(null);
	const exportContainerRef = useRef<HTMLDivElement | null>(null);
	const exportingRef = useRef(false);

	useEffect(() => {
		mountedRef.current = true;

		return () => {
			mountedRef.current = false;
			exportRootRef.current?.unmount();
			exportRootRef.current = null;
			exportContainerRef.current?.remove();
			exportContainerRef.current = null;
		};
	}, []);

	const exportToPdf = useCallback(async (presentation: Presentation) => {
		if (exportingRef.current) return;
		exportingRef.current = true;
		setIsExporting(true);
		setError(null);

		try {
			if (presentation.slides.length === 0) {
				throw new Error('В презентации нет слайдов для экспорта.');
			}

			const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
				import('html2canvas'),
				import('jspdf'),
			]);

			const container = document.createElement('div');
			container.style.position = 'fixed';
			container.style.left = '0';
			container.style.top = '0';
			container.style.zIndex = '-1';
			container.style.width = `${renderWidth}px`;
			container.style.height = `${renderHeight}px`;
			container.style.pointerEvents = 'none';
			document.body.appendChild(container);
			exportContainerRef.current = container;
			exportRootRef.current = createRoot(container);

			const pdf = new jsPDF({
				orientation: 'landscape',
				unit: 'mm',
				format: [pageWidth, pageHeight],
			});

			for (const [index, slide] of presentation.slides.entries()) {
				if (!mountedRef.current) return;

				flushSync(() => {
					exportRootRef.current?.render(
						<div style={{ width: renderWidth, height: renderHeight }}>
							<SlidePreview slide={slide} variant="pdf" />
						</div>,
					);
				});

				await document.fonts.ready;

				const slideElement = container.firstElementChild?.firstElementChild;
				if (!(slideElement instanceof HTMLElement)) {
					throw new Error(`Не удалось отобразить слайд «${slide.name}».`);
				}

				const images = Array.from(slideElement.querySelectorAll('img'));
				await Promise.all(images.map(image => image.decode()));

				const canvas = await html2canvas(slideElement, {
					backgroundColor: '#ffffff',
					scale: 2,
					useCORS: true,
					width: renderWidth,
					height: renderHeight,
					windowWidth: renderWidth,
					windowHeight: renderHeight,
					logging: false,
				});

				if (index > 0) {
					pdf.addPage([pageWidth, pageHeight], 'landscape');
				}
				pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pageWidth, pageHeight);
			}

			if (mountedRef.current) {
				const fileName = presentation.name.trim() || 'presentation';
				pdf.save(`${fileName}.pdf`);
			}
		} catch (caughtError) {
			const message = caughtError instanceof Error
				? caughtError.message
				: 'Не удалось экспортировать презентацию в PDF.';
			console.error('PDF export failed.', caughtError);
			if (mountedRef.current) setError(message);
		} finally {
			exportRootRef.current?.unmount();
			exportRootRef.current = null;
			exportContainerRef.current?.remove();
			exportContainerRef.current = null;
			exportingRef.current = false;
			if (mountedRef.current) setIsExporting(false);
		}
	}, []);

	return { exportToPdf, isExporting, error };
}

export { usePdfExport };
