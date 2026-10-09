type TextInputProps = {
	value: string;
	placeholder?: string;
	type?: 'text' | 'color' | 'number';
	onChange?: (value: string) => void;
	className?: string;
	id?: string;
};

function TextInput({ value, placeholder, type = 'text', onChange, className = '', id }: TextInputProps) {
	return (
		<input
			id={id}
			className={`text-input ${className}`.trim()}
			type={type}
			value={value}
			placeholder={placeholder}
			onChange={event => onChange?.(event.target.value)}
		/>
	);
}

export { TextInput };
