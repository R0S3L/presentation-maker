import type { Slide } from '../types/slide';
import { dispatch } from '../editor';
import {
	clearSlideBackground,
	setSlideBackgroundColor,
	setSlideBackgroundGradient,
	updateSlide,
} from '../functions/slideFunc';
import { useSlideBackgroundImage } from '../hooks/useSlideBackgroundImage';
import { useImageInput } from '../hooks/useImageInput';
import { Button } from './Button';
import { TextInput } from './TextInput';
import styles from './SlideBackgroundProperties.module.css';

type SlideBackgroundPropertiesProps = {
	slide: Slide;
};

function SlideBackgroundProperties({ slide }: SlideBackgroundPropertiesProps) {
	const backgroundImageSelected = useSlideBackgroundImage(slide);
	const { inputRef, openFilePicker, handleFileChange } = useImageInput(backgroundImageSelected);
	const gradientColors = slide.background.type === 'gradient'
		? [
			slide.background.colors[0] ?? '#dff3e8',
			slide.background.colors[1] ?? '#176b58',
		]
		: ['#dff3e8', '#176b58'];
	const gradientAngle = slide.background.type === 'gradient' ? slide.background.angle ?? 0 : 0;

	function updateGradient(colorIndex: number, color: string) {
		const colors = [...gradientColors];
		colors[colorIndex] = color;
		dispatch(presentation => updateSlide(
			presentation,
			slide.id,
			current => setSlideBackgroundGradient(current, colors, gradientAngle),
		));
	}

	function updateGradientAngle(value: number) {
		if (!Number.isFinite(value)) return;
		const angle = Math.min(360, Math.max(0, value));
		dispatch(presentation => updateSlide(
			presentation,
			slide.id,
			current => setSlideBackgroundGradient(current, gradientColors, angle),
		));
	}

	return (
		<div className={styles.panel}>
			<strong className={styles.title}>Фон слайда</strong>
				<label className={styles.label} htmlFor="slide-background">Цвет заливки</label>
				<TextInput
					id="slide-background"
					variant="color"
					type="color"
					value={slide.background.type === 'color' ? slide.background.color : '#ffffff'}
					onChange={color => dispatch(presentation => updateSlide(
						presentation,
						slide.id,
						current => setSlideBackgroundColor(current, color),
					))}
				/>
				<input
					ref={inputRef}
					className="visuallyHidden"
					type="file"
					accept="image/*"
					onChange={handleFileChange}
				/>
			<Button text="Фоновое изображение" variant="quiet" onClick={openFilePicker} />
			<div className={styles.gradientControls}>
				<span className={styles.label}>Градиент</span>
				{gradientColors.slice(0, 2).map((color, index) => (
					<label className={styles.gradientColor} key={index} aria-label={`Цвет градиента ${index + 1}`}>
						<input
							type="color"
							value={color}
							onChange={event => updateGradient(index, event.target.value)}
						/>
					</label>
				))}
				<label className={styles.angle}>
					<span className={styles.label}>Угол</span>
					<input
						type="number"
						min={0}
						max={360}
						value={gradientAngle}
						onChange={event => updateGradientAngle(Number(event.target.value))}
					/>
				</label>
			</div>
			<Button
				text="Убрать фон"
				variant="quiet"
				onClick={() => dispatch(presentation => updateSlide(
					presentation,
					slide.id,
					clearSlideBackground,
				))}
			/>
		</div>
	);
}

export { SlideBackgroundProperties };
