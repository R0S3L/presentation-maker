import { useRef } from 'react';
import type { Presentation } from '../types/presentation';
import { dispatch } from '../editor';
import { addImageObject } from '../functions/objectsFunc';
import { updatePresentationName, savePresentation } from '../functions/presentationFunc';
import { addSlide } from '../functions/slideFunc';
import { Button } from './Button';
import { TextInput } from './TextInput';
import { updateSlide } from '../functions/slideFunc';
import styles from './Toolbar.module.css';

type ToolbarProps = { presentation: Presentation; onPreview: () => void };

function Toolbar({ presentation, onPreview }: ToolbarProps) {
	const imageInput = useRef<HTMLInputElement>(null);
	const activeSlide = presentation.slides.find(slide => slide.id === presentation.activeSlideId);

	function save() {
		const blob = new Blob([savePresentation(presentation)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${presentation.name || 'presentation'}.json`;
		link.click();
		URL.revokeObjectURL(url);
	}

	function addImage(file?: File) {
		if (!file || !activeSlide) return;
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result !== 'string') return;
			dispatch(current => updateSlide(current, activeSlide.id, slide =>
				addImageObject(slide, reader.result as string, 80, 60, 320, 220)));
		};
		reader.readAsDataURL(file);
	}

	return (
		<header className={styles.toolbar}>
			<div className={styles.brandMark} role="img" aria-label="Presentation Maker">P<span>.</span></div>
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
				<Button text="＋ Слайд" variant="secondary" onClick={() => dispatch(addSlide, 'Новый слайд')} />
				<input
					ref={imageInput}
					className="visuallyHidden"
					type="file"
					accept="image/*"
					onChange={event => { addImage(event.currentTarget.files?.[0]); event.currentTarget.value = ''; }}
				/>
				<Button text="Изображение" variant="secondary" onClick={() => imageInput.current?.click()} disabled={!activeSlide} />
				<Button text="Сохранить" variant="secondary" onClick={save} />
				<Button text="Предпросмотр" variant="primary" onClick={onPreview} />
			</div>
		</header>
	);
}

export { Toolbar };
