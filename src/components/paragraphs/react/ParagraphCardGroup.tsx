import { clsx } from 'clsx'
import * as LucideIcons from 'lucide-react'
import type { ParagraphCardGroup as ParagraphCardGroupType, Card as CardType } from '@/lib/types'

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

function CardComponent({ children, variant, className }: { children: React.ReactNode; variant?: string; className?: string }) {
  const variants: Record<string, string> = {
    default: 'bg-white',
    bordered: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg hover:shadow-xl',
    highlighted: 'bg-white border-2 border-primary-500 shadow-lg',
  }
  return <div className={clsx('rounded-xl transition-all duration-200 p-6', variants[variant || 'default'], className)}>{children}</div>
}

function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx('mb-4', className)}>{children}</div>
}

function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={clsx('font-semibold text-gray-900', className)}>{children}</h3>
}

function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx('text-gray-600', className)}>{children}</div>
}

// Dynamic icon component
function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (LucideIcons as any)[name]
  if (!IconComponent) return null
  return <IconComponent className={className} />
}

function FeatureCard({ card }: { card: CardType }) {
  return (
    <CardComponent variant="bordered" className="h-full hover:border-primary-200 hover:shadow-md transition-all">
      {card.icon && (
        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
          <DynamicIcon name={card.icon} className="w-6 h-6 text-primary-600" />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{card.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {card.description && (
          <p className="text-gray-600 mb-4">{card.description}</p>
        )}
        {card.linkText && card.linkUrl && (
          <Button variant="ghost" href={card.linkUrl} className="p-0 h-auto text-primary-600 hover:text-primary-700">
            {card.linkText} →
          </Button>
        )}
      </CardContent>
    </CardComponent>
  )
}

export default function ParagraphCardGroup({
  eyebrow,
  title,
  subtitle,
  columns = '3',
  cards,
}: ParagraphCardGroupType) {
  const gridCols = {
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-3',
    '4': 'md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <section className="section-padding bg-white" id="features">
      <div className="container-wide">
        {/* Header */}
        {(eyebrow || title || subtitle) && (
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            {eyebrow && (
              <Badge variant="primary" className="mb-4">
                {eyebrow}
              </Badge>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600">{subtitle}</p>
            )}
          </div>
        )}

        {/* Cards Grid */}
        {Array.isArray(cards) && cards.length > 0 ? (
          <div className={clsx('grid gap-6 md:gap-8', gridCols[columns])}>
            {cards.map((card) => (
              <FeatureCard key={card.id} card={card} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No cards configured. Add cards in the Drupal admin.</p>
          </div>
        )}
      </div>
    </section>
  )
}
