import type { Presentation } from '../types/presentation';
import { dispatch } from '../editor';
import { removeSlides, setActiveSlide } from '../functions/slideFunc';
import { SlidePreview } from './SlidePreview';

type SlideListProps = {
	presentation: Presentation;
};

function SlideList({ presentation }: SlideListProps) {
	return (
		<aside className="slide-list" aria-label="Слайды презентации">
			<div className="panel-heading">
				<h2>Слайды</h2>
				<span className="slide-count">{presentation.slides.length}</span>
			</div>
			<div className="slide-list-items">
				{presentation.slides.map((slide, index) => (
					<button
						className={`slide-list-item${slide.id === presentation.activeSlideId ? ' is-active' : ''}`}
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
						<span className="slide-number">{String(index + 1).padStart(2, '0')}</span>
						<span className="slide-thumbnail"><SlidePreview slide={slide} /></span>
						<span className="slide-name">{slide.name}</span>
					</button>
				))}
				{presentation.slides.length === 0 && <p className="empty-message">Добавьте первый слайд</p>}
			</div>
		</aside>
	);
}

export { SlideList };
