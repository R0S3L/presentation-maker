import type { ImageObject, SlideObject as SlideObjectModel, TextObject } from '../types/objects';

type SlideObjectProps = {
  object: SlideObjectModel;
  onRemove?: (objectId: string) => void;
};

function isImageObject(object: SlideObjectModel): object is ImageObject {
  return 'type' in object && object.type === 'image';
}

function SlideObject({ object, onRemove }: SlideObjectProps) {
  const positionStyle = {
    left: `${(object.x_coord / 640) * 100}%`,
    top: `${(object.y_coord / 360) * 100}%`,
    width: `${(object.width / 640) * 100}%`,
    height: `${(object.height / 360) * 100}%`,
  };

  return (
    <div className="slide-object" style={positionStyle}>
      {isImageObject(object) ? (
        <img className="slide-object-image" src={object.path} alt="" />
      ) : (
        <TextSlideObject object={object} />
      )}
      {onRemove && (
        <button
          className="object-remove"
          type="button"
          aria-label="Удалить объект"
          onClick={() => onRemove(object.id)}
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
      className="slide-object-text"
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