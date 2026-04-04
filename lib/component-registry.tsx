/**
 * Registry of React components available as Puck render functions.
 *
 * The key matches the "puck.render" value in components-content.json.
 * To add a new component: import it and add one line here.
 *
 * NOTE: These are React components used only in the Puck editor context.
 * The site-facing pages use Astro components directly.
 */

import ParagraphHero from '@/src/components/paragraphs/react/ParagraphHero'
import ParagraphText from '@/src/components/paragraphs/react/ParagraphText'
import ParagraphNewsletter from '@/src/components/paragraphs/react/ParagraphNewsletter'
import ParagraphCardGroup from '@/src/components/paragraphs/react/ParagraphCardGroup'
import ParagraphSidebyside from '@/src/components/paragraphs/react/ParagraphSidebyside'
import ParagraphAccordion from '@/src/components/paragraphs/react/ParagraphAccordion'
import ParagraphQuote from '@/src/components/paragraphs/react/ParagraphQuote'
import ParagraphPricing from '@/src/components/paragraphs/react/ParagraphPricing'
import ParagraphLogoCollection from '@/src/components/paragraphs/react/ParagraphLogoCollection'
import ParagraphStats from '@/src/components/paragraphs/react/ParagraphStats'

export const componentRegistry: Record<string, React.ComponentType<any>> = {
  ParagraphHero,
  ParagraphText,
  ParagraphNewsletter,
  ParagraphCardGroup,
  ParagraphSidebyside,
  ParagraphAccordion,
  ParagraphQuote,
  ParagraphPricing,
  ParagraphLogoCollection,
  ParagraphStats,
}
