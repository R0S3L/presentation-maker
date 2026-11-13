import type { Presentation } from '../types/presentation';
import type { TextObject } from '../types/objects';
import { dispatch } from '../editor';
import { removeObject } from '../functions/objectsFunc';
import { useObjectDrag } from '../hooks/useObjectDrag';
import { useObjectResize } from '../hooks/useObjectResize';
import { useSlideSelection } from '../hooks/useSlideSelection';
import { SlidePreview } from './SlidePreview';
import { SlideProperties } from './SlideProperties';
import { SlideBackgroundProperties } from './SlideBackgroundProperties';
import { SlideElementsPanel } from './SlideElementsPanel';
import { updateSlide } from '../functions/slideFunc';
import styles from './Workspace.module.css';

type WorkspaceProps = { presentation: Presentation };

function Workspace({ presentation }: WorkspaceProps) {
	const slide = presentation.slides.find(item => item.id === presentation.activeSlideId);
	const { selectedObjectIds, selectObject, clearSelection } = useSlideSelection(presentation.activeSlideId);
	const { startDrag, shouldIgnoreClick } = useObjectDrag(slide, selectedObjectIds);
	const { startResize } = useObjectResize(slide);
	const selectedObject = selectedObjectIds.length === 1
		? slide?.objects.find(object => object.id === selectedObjectIds[0])
		: undefined;
	if (!slide) {
		return <section className={`${styles.workspace} ${styles.empty}`}><p>Создайте слайд, чтобы начать работу</p></section>;
	}

	return (
		<section className={styles.workspace}>
			<div className={styles.canvasArea}>
				<SlideBackgroundProperties slide={slide} />
				<div className={styles.canvasMeta}><span>СЛАЙД</span><strong>{slide.name}</strong></div>
				<SlidePreview
					slide={slide}
					selectedObjectIds={selectedObjectIds}
					onObjectClick={(objectId, shiftKey) => {
						if (shouldIgnoreClick()) return;
						selectObject(objectId, shiftKey);
					}}
					onObjectMouseDown={startDrag}
					onObjectResizeMouseDown={startResize}
					onCanvasClick={clearSelection}
					onDeleteObject={objectId => dispatch(presentation => updateSlide(
						presentation, slide.id, current => removeObject(current, objectId),
					))}
				/>
			</div>
			<div className={styles.sidePanels}>
				<SlideElementsPanel slide={slide} />
				{selectedObject && <SlideProperties slide={slide} object={selectedObject} />}
			</div>
		</section>
	);
}

export { Workspace };
