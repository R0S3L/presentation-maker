import type { Presentation } from '../types/presentation';
import { dispatch } from '../editor';
import { removeSlides, setActiveSlide } from '../functions/slideFunc';
import { SlidePreview } from './SlidePreview';
import styles from './SlideList.module.css';

type SlideListProps = {
	presentation: Presentation;
};

function SlideList({ presentation }: SlideListProps) {
	return (
		<aside className={styles.slideList} aria-label="Слайды презентации">
			<div className={styles.panelHeading}>
				<h2>Слайды</h2>
				<span className={styles.slideCount}>{presentation.slides.length}</span>
			</div>
			<div className={styles.items}>
				{presentation.slides.map((slide, index) => (
					<button
						className={`${styles.item}${slide.id === presentation.activeSlideId ? ` ${styles.active}` : ''}`}
						key={slide.id}
						type="button"
						aria-current={slide.id === presentation.activeSlideId ? 'true' : undefined}
						onClick={() => dispatch(setActiveSlide, slide.id)}
						onContextMenu={event => {
							event.preventDefault();
							if (window.confirm(`Удалить слайд «${slide.name}»?`)) {
								dispatch(removeSlides, [slide.id]);
							}
						}}
					>
						<span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
						<span className={styles.thumbnail}><SlidePreview slide={slide} variant="thumbnail" /></span>
						<span className={styles.name}>{slide.name}</span>
					</button>
				))}
				{presentation.slides.length === 0 && <p className={styles.emptyMessage}>Добавьте первый слайд</p>}
			</div>
		</aside>
	);
}

export { SlideList };
