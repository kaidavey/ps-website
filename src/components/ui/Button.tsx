import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Link } from 'react-router'
import { cx } from '@/lib/cx'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

type SharedProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Stretches to the container width. */
  block?: boolean
  children: ReactNode
  className?: string | undefined
}

type ButtonAsButton = SharedProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof SharedProps> & {
    to?: never
    href?: never
  }

type ButtonAsLink = SharedProps &
  Omit<ComponentPropsWithoutRef<'a'>, keyof SharedProps> & {
    /** Internal route — renders a client-side <Link>. */
    to: string
    href?: never
  }

type ButtonAsAnchor = SharedProps &
  Omit<ComponentPropsWithoutRef<'a'>, keyof SharedProps> & {
    /** External URL — renders a plain <a> with safe rel attributes. */
    href: string
    to?: never
  }

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor

const sizeClass = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
} as const

/**
 * The single call-to-action component.
 *
 * Renders the correct element for its purpose — `<button>` for actions,
 * router `<Link>` for internal routes, `<a>` for external URLs — so that
 * keyboard behaviour, middle-click, and screen-reader semantics are right
 * without the caller having to think about it. Discriminated by which of
 * `to` / `href` is supplied.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cx(
    styles.button,
    styles[variant],
    sizeClass[size],
    block && styles.block,
    className,
  )

  if ('to' in props && props.to !== undefined) {
    const { to, ...rest } = props
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  if ('href' in props && props.href !== undefined) {
    const { href, ...rest } = props
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noreferrer noopener"
        {...rest}
      >
        {children}
      </a>
    )
  }

  const { type = 'button', ...rest } = props as Omit<ButtonAsButton, keyof SharedProps>
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  )
}
