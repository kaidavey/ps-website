/// <reference types="vite/client" />

/**
 * CSS Modules resolve to a class-name map.
 *
 * Under `noUncheckedIndexedAccess` a lookup is `string | undefined`, which is
 * accurate — a typo'd class name really is undefined at runtime. Rather than
 * loosen the check, every class name is composed through `cx()` (src/lib/cx.ts),
 * which drops undefined and always returns a string. That is the project's one
 * rule for attaching classes; follow it and this is never friction.
 */
declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}
