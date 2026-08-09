import { forwardRef, useId } from 'react';
import './Input.css';

const Input = forwardRef(function Input(
  { label, error, hint, className = '', containerClassName = '', ...rest },
  ref
) {
  const generatedId = useId();
  const inputId = rest.id || generatedId;

  return (
    <div className={`ak-field ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="ak-field__label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`ak-field__input ${error ? 'ak-field__input--error' : ''} ${className}`}
        {...rest}
      />
      {error ? (
        <span className="ak-field__error">{error}</span>
      ) : hint ? (
        <span className="ak-field__hint">{hint}</span>
      ) : null}
    </div>
  );
});

export default Input;
