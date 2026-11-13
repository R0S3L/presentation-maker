import { beforeEach, describe, expect, test } from 'vitest';
import {
	addEditorChangeHandler,
	beginHistoryTransaction,
	dispatch,
	endHistoryTransaction,
	getHistoryState,
	getState,
	redo,
	setInitialState,
	undo,
} from '../editor';
import { createPresentation, updatePresentationName } from '../functions/presentationFunc';

describe('editor history', () => {
	beforeEach(() => {
		setInitialState(createPresentation('Initial'));
	});

	test('undo restores the previous presentation and redo restores the change', () => {
		dispatch(updatePresentationName, 'Updated');

		expect(getState()?.name).toBe('Updated');
		expect(getHistoryState()).toEqual({ canUndo: true, canRedo: false });

		undo();
		expect(getState()?.name).toBe('Initial');
		expect(getHistoryState()).toEqual({ canUndo: false, canRedo: true });

		redo();
		expect(getState()?.name).toBe('Updated');
		expect(getHistoryState()).toEqual({ canUndo: true, canRedo: false });
	});

	test('a new change after undo clears the redo history', () => {
		dispatch(updatePresentationName, 'First change');
		undo();
		dispatch(updatePresentationName, 'Second change');

		expect(getState()?.name).toBe('Second change');
		expect(getHistoryState()).toEqual({ canUndo: true, canRedo: false });
	});

	test('groups multiple drag updates into one undo and redo step', () => {
		beginHistoryTransaction();
		dispatch(updatePresentationName, 'Drag update 1');
		dispatch(updatePresentationName, 'Drag update 2');
		dispatch(updatePresentationName, 'Drag update 3');
		endHistoryTransaction();

		expect(getState()?.name).toBe('Drag update 3');
		expect(getHistoryState()).toEqual({ canUndo: true, canRedo: false });

		undo();
		expect(getState()?.name).toBe('Initial');
		expect(getHistoryState()).toEqual({ canUndo: false, canRedo: true });

		redo();
		expect(getState()?.name).toBe('Drag update 3');
		expect(getHistoryState()).toEqual({ canUndo: true, canRedo: false });
	});

	test('notifies all editor subscribers and supports unsubscribing', () => {
		let firstCalls = 0;
		let secondCalls = 0;
		const unsubscribeFirst = addEditorChangeHandler(() => firstCalls++);
		const unsubscribeSecond = addEditorChangeHandler(() => secondCalls++);

		dispatch(updatePresentationName, 'Updated');
		unsubscribeFirst();
		dispatch(updatePresentationName, 'Updated again');

		expect(firstCalls).toBe(1);
		expect(secondCalls).toBe(2);
		unsubscribeSecond();
	});
});
