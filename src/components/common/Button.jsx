import { forwardRef } from 'react';
import './Button.css';

/**
 * Reusable button.
 * variant: 'primary' | 'secondary' | 'ghost' | 'danger'
 * size: 'sm' | 'md' | 'lg'
 */
const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    disabled = false,
    icon = null,
    type = 'button',
    className = '',
    ...rest
  },
  ref
) {
  const classes = [
    'ak-btn',
    `ak-btn--${variant}`,
    `ak-btn--${size}`,
    fullWidth ? 'ak-btn--full' : '',
    isLoading ? 'ak-btn--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button ref={ref} type={type} className={classes} disabled={disabled || isLoading} {...rest}>
      {isLoading && <span className="ak-btn__spinner" aria-hidden="true" />}
      {icon && !isLoading && <span className="ak-btn__icon">{icon}</span>}
      <span className="ak-btn__label">{children}</span>
    </button>
  );
});

export default Button;
