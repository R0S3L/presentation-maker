import type { Slide } from '../types/slide';
import { dispatch } from '../editor';
import { addTextObject } from '../functions/objectsFunc';
import { useAddImageToSlide } from '../hooks/useAddImageToSlide';
import { useImageInput } from '../hooks/useImageInput';
import { useTextDraft } from '../hooks/useTextDraft';
import { Button } from './Button';
import { TextInput } from './TextInput';
import { updateSlide } from '../functions/slideFunc';
import styles from './SlideElementsPanel.module.css';

type SlideElementsPanelProps = {
	slide: Slide;
};

function SlideElementsPanel({ slide }: SlideElementsPanelProps) {
	const addImage = useAddImageToSlide(slide);
	const { inputRef: imageInput, openFilePicker, handleFileChange } = useImageInput(addImage);
	const { text, setText, clearText } = useTextDraft();

	function addText() {
		const content = text.trim();
		if (!content) return;
		dispatch(presentation => updateSlide(presentation, slide.id, current =>
			addTextObject(current, content, 48, 48, 360, 64, 'Arial', 28, '#172a2a')));
		clearText();
	}

	return (
		<aside className={styles.panel}>
			<div className={styles.panelHeading}><h2>Добавить элемент</h2></div>
			<section className={styles.section}>
				<h3>Текст</h3>
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
					onChange={handleFileChange}
				/>
				<Button text="Добавить изображение" onClick={openFilePicker} />
			</section>
		</aside>
	);
}

export { SlideElementsPanel };
