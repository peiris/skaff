import type { Faq } from '@/types/faq'

export const faqs: Faq[] = [
  {
    question: 'Is Skaff free?',
    answer: 'Yes. It is open source under the MIT license, and so is everything it generates.'
  },
  {
    question: 'Do I have to take the whole stack?',
    answer:
      'No. Every piece is a question in the wizard. Only what you tick gets installed, so a plain Next.js and Tailwind project is one run away.'
  },
  {
    question: 'Do I need OAuth apps to try authentication?',
    answer:
      'No. Google and GitHub authentication runs against emulated accounts out of the box, so the sign-in page and the protected dashboard work before you register anything.'
  },
  {
    question: 'Which coding agents does it set up?',
    answer:
      'Claude Code and Codex. Both get the same AGENTS.md rules and skills, plus agent-browser so they can load and check pages in a real browser.'
  },
  {
    question: 'Am I locked in after it runs?',
    answer:
      'No. The output is an ordinary Next.js project with no runtime dependency on Skaff. Change or delete anything.'
  }
]
