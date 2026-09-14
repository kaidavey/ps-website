import photo1 from '@/assets/images/about/carousel-1.jpg'
import photo2 from '@/assets/images/about/carousel-2.jpg'
import photo3 from '@/assets/images/about/carousel-3.jpg'
import photo4 from '@/assets/images/about/carousel-4.jpg'
import photo5 from '@/assets/images/about/carousel-5.jpg'
import photo6 from '@/assets/images/about/carousel-6.jpg'
import photo7 from '@/assets/images/about/carousel-7.jpg'
import photo8 from '@/assets/images/about/carousel-8.jpg'
import photo9 from '@/assets/images/about/carousel-9.jpg'
import photo10 from '@/assets/images/about/carousel-10.jpg'

export const about = {
  title: 'About',

  mission: {
    title: 'Our Mission',
    body: 'We aim to cultivate communities in product and nurture tomorrow’s product leaders. In Product Space, you can develop meaningful relationships, lead with empathy, and work alongside strong product leaders.',
    /** The self-scrolling strip under the statement, in Paper order. */
    photos: [
      { src: photo1, alt: 'Members gathered around the table at a Product Space Friendsgiving' },
      { src: photo2, alt: 'Members cheering on a rocky outcrop at sunset' },
      { src: photo3, alt: 'Members in summer dresses lined up on the beach at sunset' },
      { src: photo4, alt: 'Two members smiling together at an evening event' },
      { src: photo5, alt: 'Members jumping in silhouette against a sunset on the beach' },
      { src: photo6, alt: 'Two members in sunglasses hugging on the beach' },
      { src: photo7, alt: 'A big group of members at a driving range at night' },
      { src: photo8, alt: 'Two members hugging before a formal' },
      { src: photo9, alt: 'Two members making a heart with their hands over the city lights' },
      { src: photo10, alt: 'Members posing under string lights at night' },
    ],
  },

  members: {
    boardTitle: 'Our Board',
    /** `{year}` is replaced with the cohort, e.g. "Our 2025-2026 Fellows". */
    fellowsTitleTemplate: 'Our {year} Fellows',
    empty: 'No members yet.',
  },
} as const
