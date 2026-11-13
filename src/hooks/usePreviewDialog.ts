import { useState } from 'react';

function usePreviewDialog() {
	const [isOpen, setIsOpen] = useState(false);

	return {
		isOpen,
		open: () => setIsOpen(true),
		close: () => setIsOpen(false),
	};
}

export { usePreviewDialog };
