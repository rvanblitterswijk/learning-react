import React from 'react';
import styles from '../styles/App.module.css';

type InputWithLabelProps = {
    id: string;
    value: string;
    type?: string;
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isFocused?: boolean;
    children: React.ReactNode;
};

const InputWithLabel = ({ id, type = 'text', value, onInputChange, isFocused, children }: InputWithLabelProps) => {
    const inputRef = React.useRef<HTMLInputElement>(null!);;

    React.useEffect(
        () => {
            if (inputRef.current && isFocused) {
                inputRef.current.focus();
            }
        },
        [isFocused]
    );

    return (
        <>
            <label htmlFor="id" className={styles.label}>{children}</label>
      &nbsp;
            <input
                ref={inputRef}
                id={id}
                type={type}
                value={value}
                onChange={onInputChange}
                className={styles.input}
            />
        </>
    );
}

export default InputWithLabel;