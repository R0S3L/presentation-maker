import { createRoot } from 'react-dom/client';
import { App } from './components/App';
import { addEditorChangeHandler, getState, setInitialState } from './editor';
import { createTestPresentation } from './data';

// Устанавливаем начальное состояние
const initialData = createTestPresentation();
setInitialState(initialData);

// Корневой компонент приложения
const root = createRoot(document.getElementById('root')!);

function renderApp(): void {
  const presentation = getState();
  if (presentation) {
    root.render(<App presentation={presentation} />);
  }
}

// Первичная рендерка
renderApp();

// Подписываемся на изменения модели - при каждом изменении перерисовываем приложение
addEditorChangeHandler(() => {
  renderApp();
});
