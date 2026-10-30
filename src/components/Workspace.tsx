import type { Presentation } from '../types/presentation';
import { dispatch } from '../editor';
import { removeObject } from '../functions/objectsFunc';
import { SlidePreview } from './SlidePreview';
import { SlideProperties } from './SlideProperties';
import { updateSlide } from '../functions/slideFunc';
import styles from './Workspace.module.css';

type WorkspaceProps = { presentation: Presentation };

function Workspace({ presentation }: WorkspaceProps) {
	const slide = presentation.slides.find(item => item.id === presentation.activeSlideId);

	if (!slide) {
		return <section className={`${styles.workspace} ${styles.empty}`}><p>Создайте слайд, чтобы начать работу</p></section>;
	}

	return (
		<section className={styles.workspace}>
			<div className={styles.canvasArea}>
				<div className={styles.canvasMeta}><span>СЛАЙД</span><strong>{slide.name}</strong></div>
				<SlidePreview
					slide={slide}
					onDeleteObject={objectId => dispatch(presentation => updateSlide(
						presentation, slide.id, current => removeObject(current, objectId),
					))}
				/>
			</div>
			<SlideProperties slide={slide} />
		</section>
	);
}

export { Workspace };
