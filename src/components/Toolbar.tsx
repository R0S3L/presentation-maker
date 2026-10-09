import { useRef } from 'react';
import type { Presentation } from '../types/presentation';
import { dispatch } from '../editor';
import { addImageObject } from '../functions/objectsFunc';
import { updatePresentationName, savePresentation } from '../functions/presentationFunc';
import { addSlide } from '../functions/slideFunc';
import { Button } from './Button';
import { TextInput } from './TextInput';
import { updateSlide } from '../functions/slideFunc';

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
		<header className="toolbar">
			<div className="brand-mark" aria-label="Presentation Maker">P<span>.</span></div>
			<div className="presentation-title">
				<span className="eyebrow">ПРЕЗЕНТАЦИЯ</span>
				<TextInput
					className="title-input"
					value={presentation.name}
					placeholder="Название презентации"
					onChange={name => dispatch(updatePresentationName, name)}
				/>
			</div>
			<div className="toolbar-actions">
				<Button text="＋ Слайд" className="button-secondary" onClick={() => dispatch(addSlide, 'Новый слайд')} />
				<input
					ref={imageInput}
					className="visually-hidden"
					type="file"
					accept="image/*"
					onChange={event => { addImage(event.currentTarget.files?.[0]); event.currentTarget.value = ''; }}
				/>
				<Button text="Изображение" className="button-secondary" onClick={() => imageInput.current?.click()} disabled={!activeSlide} />
				<Button text="Сохранить" className="button-secondary" onClick={save} />
				<Button text="Предпросмотр" className="button-primary" onClick={onPreview} />
			</div>
		</header>
	);
}

export { Toolbar };
