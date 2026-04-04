import { useState } from 'react'
import { clsx } from 'clsx'
import { Send, CheckCircle } from 'lucide-react'
import type { ParagraphNewsletter as ParagraphNewsletterType } from '@/lib/types'

function Badge({ children, variant, className }: { children: React.ReactNode; variant?: string; className?: string }) {
  const variants: Record<string, string> = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-100 text-primary-700',
  }
  return <span className={clsx('inline-flex items-center font-medium rounded-full px-2.5 py-0.5 text-xs', variants[variant || 'default'], className)}>{children}</span>
}

function Button({ children, variant, size, type, className }: { children: React.ReactNode; variant?: string; size?: string; type?: 'button' | 'submit' | 'reset'; className?: string }) {
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
  return <button type={type || 'button'} className={classes}>{children}</button>
}

export default function ParagraphNewsletter({
  eyebrow,
  title,
  subtitle,
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  backgroundColor = 'dark',
}: ParagraphNewsletterType) {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const isDark = backgroundColor === 'dark'
  const isGradient = backgroundColor === 'gradient'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit to an API
    setIsSubmitted(true)
  }

  return (
    <section
      className={clsx(
        'section-padding',
        isDark && 'bg-gray-900',
        isGradient && 'bg-gradient-to-br from-primary-600 to-primary-800',
        backgroundColor === 'light' && 'bg-gray-50'
      )}
    >
      <div className="container-wide">
        <div className="max-w-2xl mx-auto text-center">
          {/* Header */}
          {eyebrow && (
            <Badge
              variant={isDark || isGradient ? 'primary' : 'default'}
              className="mb-4"
            >
              {eyebrow}
            </Badge>
          )}
          {title && (
            <h2
              className={clsx(
                'text-3xl md:text-4xl font-bold mb-4',
                isDark || isGradient ? 'text-white' : 'text-gray-900'
              )}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              className={clsx(
                'text-lg mb-8',
                isDark || isGradient ? 'text-gray-300' : 'text-gray-600'
              )}
            >
              {subtitle}
            </p>
          )}

          {/* Form */}
          {isSubmitted ? (
            <div
              className={clsx(
                'flex items-center justify-center gap-2 py-4',
                isDark || isGradient ? 'text-green-400' : 'text-green-600'
              )}
            >
              <CheckCircle className="w-6 h-6" />
              <span className="font-medium">Thanks for subscribing!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                required
                className={clsx(
                  'flex-1 px-5 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500',
                  isDark || isGradient
                    ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                )}
              />
              <Button
                type="submit"
                variant={isDark || isGradient ? 'secondary' : 'primary'}
                size="lg"
                className="flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {buttonText}
              </Button>
            </form>
          )}

          {/* Trust text */}
          <p
            className={clsx(
              'mt-4 text-sm',
              isDark || isGradient ? 'text-gray-400' : 'text-gray-500'
            )}
          >
            No spam, unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  )
}
