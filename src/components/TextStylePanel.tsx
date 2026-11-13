import { useEffect, useState } from 'react';
import type { TextObject } from '../types/objects';
import { dispatch } from '../editor';
import { updateTextObjectStyle } from '../functions/objectsFunc';
import { updateSlide } from '../functions/slideFunc';
import type { Slide } from '../types/slide';
import { Button } from './Button';
import styles from './TextStylePanel.module.css';

type TextStylePanelProps = {
	slide: Slide;
	textObject: TextObject;
};

const fontFamilies = ['Arial', 'Georgia', 'Times New Roman', 'Verdana', 'Courier New'];

function TextStylePanel({ slide, textObject }: TextStylePanelProps) {
	const [fontFamily, setFontFamily] = useState(textObject.fontFamily);
	const [fontSize, setFontSize] = useState(textObject.fontSize);
	const [fontColor, setFontColor] = useState(textObject.contentColor);

	useEffect(() => {
		setFontFamily(textObject.fontFamily);
		setFontSize(textObject.fontSize);
		setFontColor(textObject.contentColor);
	}, [textObject]);

	function applyStyle(nextFontFamily: string, nextFontSize: number, nextFontColor: string) {
		dispatch(presentation => updateSlide(
			presentation,
			slide.id,
			currentSlide => updateTextObjectStyle(
				currentSlide,
				textObject.id,
				nextFontFamily,
				nextFontSize,
				nextFontColor,
			),
		));
	}

	function changeFontFamily(value: string) {
		setFontFamily(value);
		applyStyle(value, fontSize, fontColor);
	}

	function changeFontSize(value: number) {
		if (!Number.isFinite(value)) return;
		const nextFontSize = Math.min(200, Math.max(8, value));
		setFontSize(nextFontSize);
		applyStyle(fontFamily, nextFontSize, fontColor);
	}

	function changeFontColor(value: string) {
		setFontColor(value);
		applyStyle(fontFamily, fontSize, value);
	}

	return (
		<section className={styles.section}>
			<h3>Свойства текста</h3>
			<label className={styles.field}>
				<span>Шрифт</span>
				<select
					className={styles.control}
					value={fontFamily}
					onChange={event => changeFontFamily(event.target.value)}
				>
					{fontFamilies.map(font => <option key={font} value={font}>{font}</option>)}
					{!fontFamilies.includes(fontFamily) && <option value={fontFamily}>{fontFamily}</option>}
				</select>
			</label>
			<label className={styles.field}>
				<span>Размер (8–200)</span>
				<span className={styles.sizeControls}>
					<Button
						text="−"
						variant="quiet"
						onClick={() => changeFontSize(fontSize - 1)}
						disabled={fontSize <= 8}
					/>
					<input
						className={styles.control}
						type="number"
						min={8}
						max={200}
						value={fontSize}
						onChange={event => changeFontSize(Number(event.target.value))}
					/>
					<Button
						text="+"
						variant="quiet"
						onClick={() => changeFontSize(fontSize + 1)}
						disabled={fontSize >= 200}
					/>
				</span>
			</label>
			<label className={styles.field}>
				<span>Цвет текста</span>
				<input
					className={`${styles.control} ${styles.color}`}
					type="color"
					value={fontColor}
					onChange={event => changeFontColor(event.target.value)}
				/>
			</label>
		</section>
	);
}

export { TextStylePanel };
