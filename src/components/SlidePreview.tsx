import type { CSSProperties } from 'react';
import type { MouseEvent } from 'react';
import type { SlideObject as SlideObjectModel } from '../types/objects';
import type { Slide } from '../types/slide';
import { SlideObject } from './SlideObject';
import styles from './SlidePreview.module.css';

type SlidePreviewProps = {
	slide: Slide;
	onDeleteObject?: (objectId: string) => void;
	selectedObjectIds?: string[];
	onObjectClick?: (objectId: string, shiftKey: boolean) => void;
	onObjectMouseDown?: (event: MouseEvent<HTMLDivElement>, objectId: string) => void;
	onObjectResizeMouseDown?: (event: MouseEvent<HTMLDivElement>, object: SlideObjectModel) => void;
	onCanvasClick?: () => void;
	variant?: 'thumbnail' | 'presentation' | 'pdf';
};

function SlidePreview({
	slide,
	onDeleteObject,
	selectedObjectIds = [],
	onObjectClick,
	onObjectMouseDown,
	onObjectResizeMouseDown,
	onCanvasClick,
	variant,
}: SlidePreviewProps) {
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
			onClick={onCanvasClick}
		>
			{slide.objects.map(object => (
				<SlideObject
					key={object.id}
					object={object}
					onRemove={onDeleteObject}
					selected={selectedObjectIds.includes(object.id)}
					onClick={onObjectClick}
					onMouseDown={onObjectMouseDown}
					onResizeMouseDown={onObjectResizeMouseDown}
				/>
			))}
		</div>
	);
}

export { SlidePreview };
