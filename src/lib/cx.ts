/**
 * Joins class names, dropping falsy values.
 *
 * Exists so components can compose CSS Module classes with conditional and
 * caller-supplied ones without pulling in a dependency for eight lines of code.
 */
export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ')
}
