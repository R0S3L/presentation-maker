import type { MouseEvent } from 'react';
import type { ImageObject, SlideObject as SlideObjectModel, TextObject } from '../types/objects';
import styles from './SlideObject.module.css';

type SlideObjectProps = {
  object: SlideObjectModel;
  onRemove?: (objectId: string) => void;
  selected?: boolean;
  onClick?: (objectId: string, shiftKey: boolean) => void;
};

function isImageObject(object: SlideObjectModel): object is ImageObject {
  return 'type' in object && object.type === 'image';
}

function SlideObject({ object, onRemove, selected = false, onClick }: SlideObjectProps) {
  const positionStyle = {
    left: `${(object.x_coord / 640) * 100}%`,
    top: `${(object.y_coord / 360) * 100}%`,
    width: `${(object.width / 640) * 100}%`,
    height: `${(object.height / 360) * 100}%`,
  };

  return (
    <div
      className={`${styles.object}${selected ? ` ${styles.selected}` : ''}`}
      style={positionStyle}
      onClick={(event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        onClick?.(object.id, event.shiftKey);
      }}
    >
      {isImageObject(object) ? (
        <img className={styles.image} src={object.path} alt="" />
      ) : (
        <TextSlideObject object={object} />
      )}
      {onRemove && (
        <button
          className={styles.remove}
          type="button"
          aria-label="Удалить объект"
          onClick={event => {
            event.stopPropagation();
            onRemove(object.id);
          }}
        >
            ×
        </button>
      )}
    </div>
  );
}

function TextSlideObject({ object }: { object: TextObject }) {
  return (
    <div
      className={styles.text}
      style={{
        color: object.contentColor,
        fontFamily: object.fontFamily,
        fontSize: `${(object.fontSize / 640) * 100}cqw`,
      }}
    >
      {object.content}
    </div>
  );
}

export { SlideObject };