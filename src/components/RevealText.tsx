import type { CSSProperties } from 'react'
import { cx } from '@/lib/cx'
import styles from './RevealText.module.css'

interface RevealTextProps {
  paragraphs: readonly string[]
  className?: string
}

/**
 * Paragraphs whose words darken one after another as the nearest scroll track advances.
 * Each word carries its position in the sequence; the CSS compares that to `--progress`,
 * which useScrollProgress writes onto an ancestor. Without JS every word renders at full
 * contrast, so the copy is always readable.
 */
export function RevealText({ paragraphs, className }: RevealTextProps) {
  const paragraphWords = paragraphs.map((paragraph) => paragraph.split(/\s+/))
  const wordCount = paragraphWords.reduce((total, words) => total + words.length, 0)

  // Index of the first word of each paragraph within the whole passage.
  let offset = 0
  const offsets = paragraphWords.map((words) => {
    const start = offset
    offset += words.length
    return start
  })

  return (
    <div className={cx(styles.text, className)} style={{ '--word-count': wordCount } as CSSProperties}>
      {paragraphWords.map((words, paragraphIndex) => (
        <p key={paragraphs[paragraphIndex]}>
          {words.map((word, index) => (
            <span
              key={`${offsets[paragraphIndex] + index}-${word}`}
              className={styles.word}
              style={{ '--word-index': offsets[paragraphIndex] + index } as CSSProperties}
            >
              {word}{' '}
            </span>
          ))}
        </p>
      ))}
    </div>
  )
}
