import { useState } from 'react';

function useTextDraft() {
	const [text, setText] = useState('');

	return {
		text,
		setText,
		clearText: () => setText(''),
	};
}

export { useTextDraft };
