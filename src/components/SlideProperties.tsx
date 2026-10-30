import { useRef, useState } from 'react';
import type { Slide } from '../types/slide';
import { dispatch } from '../editor';
import { addImageObject, addTextObject } from '../functions/objectsFunc';
import { clearSlideBackground, setSlideBackgroundColor } from '../functions/slideFunc';
import { Button } from './Button';
import { TextInput } from './TextInput';
import { updateSlide } from '../functions/slideFunc';
import styles from './SlideProperties.module.css';

type SlidePropertiesProps = {
	slide: Slide;
};

function SlideProperties({ slide }: SlidePropertiesProps) {
	const [text, setText] = useState('');
	const imageInput = useRef<HTMLInputElement>(null);

	function addText() {
		const content = text.trim();
		if (!content) return;
		dispatch(presentation => updateSlide(presentation, slide.id, current =>
			addTextObject(current, content, 48, 48, 360, 64, 'Arial', 28, '#172a2a')));
		setText('');
	}

	function addImage(file?: File) {
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result !== 'string') return;
			dispatch(presentation => updateSlide(presentation, slide.id, current =>
				addImageObject(current, reader.result as string, 80, 60, 320, 220)));
		};
		reader.readAsDataURL(file);
	}

	return (
		<aside className={styles.panel}>
			<div className={styles.panelHeading}><h2>Свойства</h2><span className={styles.slideName}>{slide.name}</span></div>
			<section className={styles.section}>
				<h3>Фон</h3>
				<label className={styles.fieldLabel} htmlFor="slide-background">Цвет заливки</label>
				<div className={styles.colorField}>
					<TextInput
						id="slide-background"
						variant="color"
						type="color"
						value={slide.background.type === 'color' ? slide.background.color : '#ffffff'}
						onChange={color => dispatch(presentation => updateSlide(
							presentation, slide.id, current => setSlideBackgroundColor(current, color),
						))}
					/>
					<Button text="Сбросить" variant="quiet" onClick={() => dispatch(
						presentation => updateSlide(presentation, slide.id, clearSlideBackground),
					)} />
				</div>
			</section>
			<section className={styles.section}>
				<h3>Текстовый объект</h3>
				<TextInput value={text} placeholder="Введите текст" onChange={setText} />
				<Button text="Добавить текст" onClick={addText} />
			</section>
			<section className={styles.section}>
				<h3>Изображение</h3>
				<input
					ref={imageInput}
					className="visuallyHidden"
					type="file"
					accept="image/*"
					onChange={event => { addImage(event.currentTarget.files?.[0]); event.currentTarget.value = ''; }}
				/>
				<Button text="Выбрать изображение" onClick={() => imageInput.current?.click()} />
			</section>
		</aside>
	);
}

export { SlideProperties };
