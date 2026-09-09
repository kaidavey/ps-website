import { useId, type ComponentPropsWithoutRef } from 'react'
import { cx } from '@/lib/cx'
import styles from './FormField.module.css'

interface FieldProps {
  label: string
  name: string
  required?: boolean
  className?: string
}

/**
 * Form controls styled to the design's filled fields. The label is rendered for assistive
 * technology and shown visually as the placeholder, matching the design.
 */
export function TextField({
  label,
  name,
  required,
  className,
  ...rest
}: FieldProps & Pick<ComponentPropsWithoutRef<'input'>, 'type' | 'autoComplete'>) {
  const id = useId()
  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={id} className="visually-hidden">
        {label}
      </label>
      <input
        id={id}
        name={name}
        required={required}
        placeholder={placeholderFor(label, required)}
        className={cx('type-body', styles.control)}
        {...rest}
      />
    </div>
  )
}

export function SelectField({
  label,
  name,
  required,
  className,
  options,
}: FieldProps & { options: readonly string[] }) {
  const id = useId()
  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={id} className="visually-hidden">
        {label}
      </label>
      <select id={id} name={name} required={required} defaultValue="" className={cx('type-body', styles.control, styles.select)}>
        <option value="" disabled>
          {placeholderFor(label, required)}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <svg viewBox="0 0 20 12" className={styles.chevron} aria-hidden="true" focusable="false">
        <path d="M2 2l8 8 8-8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export function TextAreaField({ label, name, required, className }: FieldProps) {
  const id = useId()
  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={id} className="visually-hidden">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        required={required}
        placeholder={placeholderFor(label, required)}
        className={cx('type-body', styles.control, styles.textarea)}
      />
    </div>
  )
}

const placeholderFor = (label: string, required?: boolean) => (required ? `${label} *` : label)
