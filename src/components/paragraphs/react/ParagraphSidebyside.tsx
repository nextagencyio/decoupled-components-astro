import { clsx } from 'clsx'
import * as LucideIcons from 'lucide-react'
import type { ParagraphSidebyside as ParagraphSidebysideType } from '@/lib/types'
import { Check } from 'lucide-react'

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

// Convert http URLs to https
function secureUrl(url: string): string {
  return url.replace(/^http:\/\//, 'https://')
}

// Dynamic icon component
function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (LucideIcons as any)[name]
  if (!IconComponent) return <Check className={className} />
  return <IconComponent className={className} />
}

export default function ParagraphSidebyside({
  eyebrow,
  title,
  content,
  image,
  imagePosition = 'right',
  features,
  ctaText,
  ctaUrl,
}: ParagraphSidebysideType) {
  const isImageLeft = imagePosition === 'left'

  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <div
          className={clsx(
            'grid md:grid-cols-2 gap-12 md:gap-16 items-center',
            isImageLeft && 'md:flex-row-reverse'
          )}
        >
          {/* Content */}
          <div className={clsx(isImageLeft && 'md:order-2')}>
            {eyebrow && (
              <Badge variant="primary" className="mb-4">
                {eyebrow}
              </Badge>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {title}
              </h2>
            )}
            {content && (
              <div
                className="prose prose-lg text-gray-600 mb-8"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}

            {/* Features List */}
            {Array.isArray(features) && features.length > 0 && (
              <ul className="space-y-4 mb-8">
                {features.map((feature) => (
                  <li key={feature.id} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <DynamicIcon
                        name={feature.icon || 'Check'}
                        className="w-5 h-5 text-primary-600"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      {feature.description && (
                        <p className="text-gray-600 text-sm">
                          {feature.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* CTA */}
            {ctaText && ctaUrl && (
              <Button variant="primary" href={ctaUrl}>
                {ctaText}
              </Button>
            )}
          </div>

          {/* Image */}
          <div
            className={clsx(
              'relative aspect-square md:aspect-auto md:h-[500px] rounded-2xl overflow-hidden bg-gray-100',
              isImageLeft && 'md:order-1'
            )}
          >
            {image?.url ? (
              <img
                src={secureUrl(image.url)}
                alt={image.alt || title || ''}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                <div className="w-24 h-24 bg-white/50 rounded-2xl flex items-center justify-center">
                  <DynamicIcon name="Image" className="w-12 h-12 text-primary-300" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
