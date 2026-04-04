import { clsx } from 'clsx'
import type { ParagraphHero as ParagraphHeroType } from '@/lib/types'

function Badge({ children, variant, size, className }: { children: React.ReactNode; variant?: string; size?: string; className?: string }) {
  const variants: Record<string, string> = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-100 text-primary-700',
  }
  const sizes: Record<string, string> = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }
  return <span className={clsx('inline-flex items-center font-medium rounded-full', variants[variant || 'default'], sizes[size || 'sm'], className)}>{children}</span>
}

function Button({ children, variant, size, href, className }: { children: React.ReactNode; variant?: string; size?: string; href?: string; className?: string }) {
  const variants: Record<string, string> = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 shadow-sm',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  }
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  }
  const classes = clsx('inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2', variants[variant || 'primary'], sizes[size || 'md'], className)
  if (href) return <a href={href} className={classes}>{children}</a>
  return <button className={classes}>{children}</button>
}

export default function ParagraphHero({
  eyebrow,
  title,
  subtitle,
  layout = 'centered',
  backgroundColor,
  backgroundImage,
  primaryCtaText,
  primaryCtaUrl,
  secondaryCtaText,
  secondaryCtaUrl,
}: ParagraphHeroType) {
  const isGradient = backgroundColor === 'gradient'
  const isDark = backgroundColor === 'dark' || isGradient

  return (
    <section
      className={clsx(
        'relative overflow-hidden',
        isGradient && 'bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900',
        backgroundColor === 'dark' && 'bg-gray-900',
        backgroundColor === 'light' && 'bg-gray-50',
        !backgroundColor && 'bg-white'
      )}
    >
      {/* Background image */}
      {backgroundImage?.url && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage.url})` }}
        >
          <div className="absolute inset-0 bg-gray-900/70" />
        </div>
      )}

      {/* Decorative elements */}
      {isGradient && (
        <>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />
        </>
      )}

      <div
        className={clsx(
          'relative container-wide py-20 md:py-28 lg:py-36',
          layout === 'centered' && 'text-center',
          layout === 'left-aligned' && 'text-left'
        )}
      >
        <div className={clsx(layout === 'centered' && 'max-w-4xl mx-auto')}>
          {/* Eyebrow */}
          {eyebrow && (
            <Badge
              variant={isDark ? 'primary' : 'default'}
              size="md"
              className="mb-6"
            >
              {eyebrow}
            </Badge>
          )}

          {/* Title */}
          <h1
            className={clsx(
              'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6',
              isDark || backgroundImage ? 'text-white' : 'text-gray-900'
            )}
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <div
              className={clsx(
                'text-lg md:text-xl max-w-2xl mb-10 [&>p]:m-0',
                layout === 'centered' && 'mx-auto',
                isDark || backgroundImage ? 'text-gray-200' : 'text-gray-600'
              )}
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          )}

          {/* CTAs */}
          {(primaryCtaText || secondaryCtaText) && (
            <div
              className={clsx(
                'flex flex-col sm:flex-row gap-4',
                layout === 'centered' && 'justify-center'
              )}
            >
              {primaryCtaText && primaryCtaUrl && (
                <Button
                  variant={isDark ? 'secondary' : 'primary'}
                  size="lg"
                  href={primaryCtaUrl}
                >
                  {primaryCtaText}
                </Button>
              )}
              {secondaryCtaText && secondaryCtaUrl && (
                <Button
                  variant="outline"
                  size="lg"
                  href={secondaryCtaUrl}
                  className={isDark ? 'border-white text-white hover:bg-white/10' : ''}
                >
                  {secondaryCtaText}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
