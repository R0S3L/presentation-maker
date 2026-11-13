import { useCallback, useRef } from 'react';
import type { ChangeEvent } from 'react';

function useImageInput(onImageSelected: (file: File) => void) {
	const inputRef = useRef<HTMLInputElement>(null);

	const openFilePicker = useCallback(() => {
		inputRef.current?.click();
	}, []);

	const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		const file = event.currentTarget.files?.[0];
		event.currentTarget.value = '';
		if (file) onImageSelected(file);
	}, [onImageSelected]);

	return { inputRef, openFilePicker, handleFileChange };
}

export { useImageInput };
