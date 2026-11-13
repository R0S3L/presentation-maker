import { useCallback, useEffect, useState } from 'react';
import { addEditorChangeHandler, getHistoryState, redo, undo } from '../editor';

function useHistoryUI() {
	const [history, setHistory] = useState(getHistoryState);

	useEffect(() => {
		const syncHistory = () => setHistory(getHistoryState());
		const unsubscribe = addEditorChangeHandler(syncHistory);
		syncHistory();

		return unsubscribe;
	}, []);

	const onUndo = useCallback(() => undo(), []);
	const onRedo = useCallback(() => redo(), []);

	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (!(event.ctrlKey || event.metaKey)) return;

			const target = event.target;
			if (
				target instanceof HTMLElement
				&& (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
			) {
				return;
			}

			if (event.key.toLowerCase() === 'z') {
				event.preventDefault();
				if (event.shiftKey) onRedo();
				else onUndo();
			} else if (event.key.toLowerCase() === 'y') {
				event.preventDefault();
				onRedo();
			}
		}

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [onRedo, onUndo]);

	return {
		canUndo: history.canUndo,
		canRedo: history.canRedo,
		onUndo,
		onRedo,
	};
}

export { useHistoryUI };
