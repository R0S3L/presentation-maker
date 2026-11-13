import type { Presentation } from '../types/presentation';
import { dispatch } from '../editor';
import { updatePresentationName, savePresentation } from '../functions/presentationFunc';
import { addSlide } from '../functions/slideFunc';
import { useAddImageToSlide } from '../hooks/useAddImageToSlide';
import { useImageInput } from '../hooks/useImageInput';
import { usePdfExport } from '../hooks/usePdfExport';
import { Button } from './Button';
import { TextInput } from './TextInput';
import styles from './Toolbar.module.css';

type ToolbarProps = {
	presentation: Presentation;
	onPreview: () => void;
	canUndo: boolean;
	canRedo: boolean;
	onUndo: () => void;
	onRedo: () => void;
};

function Toolbar({ presentation, onPreview, canUndo, canRedo, onUndo, onRedo }: ToolbarProps) {
	const activeSlide = presentation.slides.find(slide => slide.id === presentation.activeSlideId);
	const addImage = useAddImageToSlide(activeSlide);
	const { inputRef: imageInput, openFilePicker, handleFileChange } = useImageInput(addImage);
	const { exportToPdf, isExporting, error: exportError } = usePdfExport();

	function save() {
		const blob = new Blob([savePresentation(presentation)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${presentation.name || 'presentation'}.json`;
		link.click();
		URL.revokeObjectURL(url);
	}

	return (
		<header className={styles.toolbar}>
			<div className={styles.presentationTitle}>
				<span className={styles.eyebrow}>ПРЕЗЕНТАЦИЯ</span>
				<TextInput
					variant="title"
					value={presentation.name}
					placeholder="Название презентации"
					onChange={name => dispatch(updatePresentationName, name)}
				/>
			</div>
			<div className={styles.actions}>
				<Button text="↩" variant="secondary" onClick={onUndo} disabled={!canUndo} />
				<Button text="↪" variant="secondary" onClick={onRedo} disabled={!canRedo} />
				<Button text="＋ Слайд" variant="secondary" onClick={() => dispatch(addSlide, 'Новый слайд')} />
				<input
					ref={imageInput}
					className="visuallyHidden"
					type="file"
					accept="image/*"
					onChange={handleFileChange}
				/>
				<Button text="Сохранить" variant="secondary" onClick={save} />
				<Button
					text={isExporting ? 'Экспорт PDF…' : 'Экспорт PDF'}
					variant="secondary"
					onClick={() => void exportToPdf(presentation)}
					disabled={isExporting}
				/>
				<Button text="Предпросмотр" variant="primary" onClick={onPreview} />
			</div>
			{exportError && <p className={styles.exportError} role="alert">{exportError}</p>}
		</header>
	);
}

export { Toolbar };
