import { createRoot } from 'react-dom/client';
import { App } from './components/App';
import { addEditorChangeHandler, setInitialState } from './editor';
import { createTestPresentation } from './data';

// Устанавливаем начальное состояние
const initialData = createTestPresentation();
setInitialState(initialData);

// Корневой компонент приложения
const root = createRoot(document.getElementById('root')!);

function renderApp(): void {
  root.render(<App />);
}

// Первичная рендерка
renderApp();

// Подписываемся на изменения модели -- при каждом изменении перерисовываем приложение
addEditorChangeHandler(() => {
  renderApp();
});
