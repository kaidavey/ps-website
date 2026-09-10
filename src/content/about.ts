import photo1 from '@/assets/images/about-1.jpg'
import photo2 from '@/assets/images/about-2.jpg'
import photo3 from '@/assets/images/about-3.jpg'
import photo4 from '@/assets/images/about-4.png'

export const about = {
  title: 'About',

  mission: {
    title: 'Our Mission',
    body: 'We aim to cultivate communities in product and nurture tomorrow’s product leaders. In Product Space, you can develop meaningful relationships, lead with empathy, and work alongside strong product leaders.',
    photos: [
      { src: photo1, alt: 'Members jumping in silhouette against a sunset on the beach' },
      { src: photo2, alt: 'Two graduating members posing back to back at an evening celebration' },
      { src: photo3, alt: 'Four members together on the shore at sunset' },
      { src: photo4, alt: 'The cohort gathered on the steps of a UCLA building for a group photo' },
    ],
  },

  members: {
    boardTitle: 'Our Board',
    /** `{year}` is replaced with the cohort, e.g. "Our 2025-2026 Fellows". */
    fellowsTitleTemplate: 'Our {year} Fellows',
    empty: 'No members yet.',
  },
} as const
