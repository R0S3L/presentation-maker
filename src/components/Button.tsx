import styles from './Button.module.css';

type ButtonVariant = 'secondary' | 'primary' | 'quiet' | 'previewClose' | 'previewNav';

type ButtonProps = {
	text: string;
	onClick: () => void;
	variant?: ButtonVariant;
	disabled?: boolean;
};

function Button({ text, onClick, variant, disabled = false }: ButtonProps) {
	return (
		<button
			className={`${styles.button} ${variant ? styles[variant] : ''}`.trim()}
			type="button"
			onClick={onClick}
			disabled={disabled}
		>
			{text}
		</button>
	);
}

export { Button };
