import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cx } from '@/lib/cx'
import styles from './Button.module.css'

interface BaseProps {
  variant?: 'primary' | 'secondary'
  size?: 'md' | 'lg'
  className?: string
  children: ReactNode
}

type ButtonProps = BaseProps &
  (
    | { to: string; href?: never; type?: never }
    | { href: string; to?: never; type?: never }
    | ({ to?: never; href?: never } & Pick<ComponentPropsWithoutRef<'button'>, 'type' | 'onClick' | 'disabled'>)
  )

/** Renders a router link (`to`), an external anchor (`href`) or a native button with shared styling. */
export function Button({ variant = 'primary', size = 'md', className, children, ...rest }: ButtonProps) {
  const classes = cx('type-body-strong', styles.button, styles[variant], size === 'lg' && styles.large, className)

  if ('to' in rest && rest.to !== undefined) {
    return (
      <Link to={rest.to} className={classes}>
        {children}
      </Link>
    )
  }
  if ('href' in rest && rest.href !== undefined) {
    return (
      <a href={rest.href} className={classes} target="_blank" rel="noreferrer">
        {children}
      </a>
    )
  }
  const { type = 'button', ...buttonProps } = rest
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  )
}
