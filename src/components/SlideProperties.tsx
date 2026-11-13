import type { SlideObject } from '../types/objects';
import type { Slide } from '../types/slide';
import styles from './SlideProperties.module.css';
import { TextStylePanel } from './TextStylePanel';

type SlidePropertiesProps = {
	slide: Slide;
	object: SlideObject;
};

function SlideProperties({ slide, object }: SlidePropertiesProps) {
	const isTextObject = 'content' in object;

	return (
		<aside className={styles.panel}>
			<div className={styles.panelHeading}>
				<h2>{isTextObject ? 'Свойства текста' : 'Свойства изображения'}</h2>
			</div>
			{isTextObject ? (
				<TextStylePanel slide={slide} textObject={object} />
			) : (
				<section className={styles.section}>
					<p className={styles.detail}>Положение: {Math.round(object.x_coord)}, {Math.round(object.y_coord)}</p>
					<p className={styles.detail}>Размер: {Math.round(object.width)} × {Math.round(object.height)}</p>
				</section>
			)}
		</aside>
	);
}

export { SlideProperties };
