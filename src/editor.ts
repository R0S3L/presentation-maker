import type { Presentation } from './types/presentation';

let currentPresentation: Presentation | null = null;

/**
 * Устанавливает начальное состояние презентации.
 * Вызывается один раз при загрузке приложения.
 */
function setInitialState(presentation: Presentation): void {
  currentPresentation = presentation;
}

/**
 * Возвращает актуальное состояние презентации.
 * Вызывается из index.tsx для рендеринга.
 */
function getState(): Presentation | null {
  return currentPresentation;
}

let editorChangeHandler: (() => void) | null = null;

/**
 * Добавляет обработчик изменения модели редактора.
 * Вызывается при каждом изменении состояния.
 */
function addEditorChangeHandler(handler: () => void): void {
  editorChangeHandler = handler;
}


/**
 * Функция-модификатор -- функция, которая принимает модель и возвращает новую модель.
 * Тип используется только для подсказок. В runtime типизация теряется,
 * поэтому нужно быть внимательными при передаче параметров.
 */
type Modifier<P = any> = (model: Presentation, params: P) => Presentation;

let modifierParams: any = null;

/**
 * Изменяет модель приложения.
 * Первый параметр -- функция-модификатор, изменяющая модель приложения.
 * Второй параметр -- параметры, необходимые для функции-модификатора.
 */
function dispatch(modifier: Modifier, params: any = null): void {
  if (!currentPresentation) {
    console.error('State is not initialized! Call setInitialState first.');
    return;
  }

  modifierParams = params;
  currentPresentation = modifier(currentPresentation, params);

  // Вызываем обработчик изменения, если он установлен
  if (editorChangeHandler) {
    editorChangeHandler();
  }
}

export { setInitialState, getState, dispatch, addEditorChangeHandler };
