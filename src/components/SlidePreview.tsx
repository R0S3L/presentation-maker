import type { CSSProperties } from 'react';
import type { Slide } from '../types/slide';
import { SlideObject } from './SlideObject';
import styles from './SlidePreview.module.css';

type SlidePreviewProps = {
	slide: Slide;
	onDeleteObject?: (objectId: string) => void;
	variant?: 'thumbnail' | 'presentation';
};

function SlidePreview({ slide, onDeleteObject, variant }: SlidePreviewProps) {
	const backgroundStyle: CSSProperties = {};

	switch (slide.background.type) {
		case 'color':
			backgroundStyle.backgroundColor = slide.background.color;
			break;
		case 'image':
			backgroundStyle.backgroundImage = `url("${slide.background.imageUrl}")`;
			backgroundStyle.backgroundSize = 'cover';
			backgroundStyle.backgroundPosition = 'center';
			break;
		case 'gradient':
			backgroundStyle.background = `linear-gradient(${slide.background.angle ?? 0}deg, ${slide.background.colors.join(', ')})`;
			break;
		case 'none':
			backgroundStyle.backgroundColor = '#ffffff';
			break;
	}

	return (
		<div
			className={`${styles.canvas} ${variant ? styles[variant] : ''}`.trim()}
			style={backgroundStyle}
			role="group"
			aria-label={slide.name}
		>
			{slide.objects.map(object => (
				<SlideObject key={object.id} object={object} onRemove={onDeleteObject} />
			))}
		</div>
	);
}

export { SlidePreview };
