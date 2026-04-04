import { useState } from 'react'
import { clsx } from 'clsx'
import { ChevronDown } from 'lucide-react'
import type { ParagraphAccordion as ParagraphAccordionType } from '@/lib/types'

function Badge({ children, variant, className }: { children: React.ReactNode; variant?: string; className?: string }) {
  const variants: Record<string, string> = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-100 text-primary-700',
  }
  return <span className={clsx('inline-flex items-center font-medium rounded-full px-2.5 py-0.5 text-xs', variants[variant || 'default'], className)}>{children}</span>
}

export default function ParagraphAccordion({
  eyebrow,
  title,
  subtitle,
  items,
}: ParagraphAccordionType) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          {(eyebrow || title || subtitle) && (
            <div className="text-center mb-12">
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

          {/* Accordion Items */}
          {Array.isArray(items) && items.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 divide-y divide-gray-200">
              {items.map((item, index) => (
                <div key={item.id} className="overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="flex w-full items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                    aria-expanded={openIndex === index}
                  >
                    <span className="text-lg font-medium text-gray-900 pr-4">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={clsx(
                        'flex-shrink-0 w-5 h-5 text-gray-500 transition-transform duration-200',
                        openIndex === index && 'rotate-180'
                      )}
                    />
                  </button>
                  {item.answer && (
                    <div
                      className={clsx(
                        'overflow-hidden transition-all duration-200',
                        openIndex === index ? 'max-h-96' : 'max-h-0'
                      )}
                    >
                      <div
                        className="px-6 pb-6 prose prose-gray max-w-none"
                        dangerouslySetInnerHTML={{ __html: item.answer }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
