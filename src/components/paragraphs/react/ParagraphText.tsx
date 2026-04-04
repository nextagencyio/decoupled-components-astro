import { clsx } from 'clsx'
import type { ParagraphText as ParagraphTextType } from '@/lib/types'

function Badge({ children, variant, className }: { children: React.ReactNode; variant?: string; className?: string }) {
  const variants: Record<string, string> = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-100 text-primary-700',
  }
  return <span className={clsx('inline-flex items-center font-medium rounded-full px-2.5 py-0.5 text-xs', variants[variant || 'default'], className)}>{children}</span>
}

function Button({ children, variant, href, className }: { children: React.ReactNode; variant?: string; href?: string; className?: string }) {
  const variants: Record<string, string> = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 shadow-sm',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  }
  const classes = clsx('inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 px-5 py-2.5 text-base', variants[variant || 'primary'], className)
  if (href) return <a href={href} className={classes}>{children}</a>
  return <button className={classes}>{children}</button>
}

export default function ParagraphText({
  eyebrow,
  title,
  content,
  alignment = 'left',
  ctaText,
  ctaUrl,
}: ParagraphTextType) {
  const isCentered = alignment === 'center'

  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <div
          className={clsx(
            'max-w-3xl',
            isCentered ? 'mx-auto text-center' : ''
          )}
        >
          {/* Eyebrow */}
          {eyebrow && (
            <Badge variant="primary" className="mb-4">
              {eyebrow}
            </Badge>
          )}

          {/* Title */}
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {title}
            </h2>
          )}

          {/* Content */}
          {content && (
            <div
              className={clsx(
                'prose prose-lg max-w-none',
                isCentered && 'prose-center'
              )}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}

          {/* CTA */}
          {ctaText && ctaUrl && (
            <div className={clsx('mt-8', isCentered && 'text-center')}>
              <Button variant="primary" href={ctaUrl}>
                {ctaText}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
