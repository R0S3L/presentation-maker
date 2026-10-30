import styles from './TextInput.module.css';

type TextInputVariant = 'title' | 'color';

type TextInputProps = {
	value: string;
	placeholder?: string;
	type?: 'text' | 'color' | 'number';
	onChange?: (value: string) => void;
	variant?: TextInputVariant;
	id?: string;
};

function TextInput({ value, placeholder, type = 'text', onChange, variant, id }: TextInputProps) {
	return (
		<input
			id={id}
			className={`${styles.input} ${variant ? styles[variant] : ''}`.trim()}
			type={type}
			value={value}
			placeholder={placeholder}
			onChange={event => onChange?.(event.target.value)}
		/>
	);
}

export { TextInput };
