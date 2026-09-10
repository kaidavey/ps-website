import gallery1 from '@/assets/images/gallery-1.jpg'
import gallery2 from '@/assets/images/gallery-2.jpg'
import gallery3 from '@/assets/images/gallery-3.jpg'
import gallery4 from '@/assets/images/gallery-4.jpg'
import gallery5 from '@/assets/images/gallery-5.jpg'
import pillarCommunity from '@/assets/images/pillar-community.jpg'
import pillarFellowship from '@/assets/images/pillar-fellowship.jpg'

export const home = {
  hero: {
    title: 'product space',
    tagline: 'Building the Next Generation of Tech Leaders',
    prompt: 'Have a project in mind? Let’s chat!',
    cta: { label: 'Learn more', to: '/for-companies' },
    imageAlt: 'The Product Space at UCLA fellows, gathered for a group photo in graduation sashes.',
  },

  intro: [
    'We are UCLA’s chapter of Product Space, a nation-wide family of students passionate about digital product development.',
    'We provide a year-long fellowship for aspiring product managers, product designers, and product marketers to learn from mentors and grow from industry-focused client projects.',
  ],

  gallery: [
    { src: gallery1, alt: 'Fellows collaborating during a workshop' },
    { src: gallery2, alt: 'Product Space members at a social event' },
    { src: gallery3, alt: 'A team presenting their client project' },
    { src: gallery4, alt: 'Fellows at a campus gathering' },
    { src: gallery5, alt: 'Members celebrating the end of a quarter' },
  ],

  howItWorks: {
    title: 'How It Works',
    subtitle: 'Product Space is built on three pillars.',
  },

  pillars: [
    {
      title: 'Community',
      description: 'Learn, grow, and make life-long friends along the way.',
      image: pillarCommunity,
    },
    {
      title: 'Fellowship',
      description: 'Build skills through mentor-led workshops and sprints.',
      image: pillarFellowship,
    },
    {
      title: 'Projects',
      description: 'Ship work for companies from Fortune 500s to YC startups.',
      // Rendered as composed artwork; see ProjectArt in Pillars.tsx.
      image: null,
    },
  ],

  events: {
    title: 'Upcoming Events',
    subtitle: 'Curious to learn more? Join us for our external events.',
    empty: 'Nothing on the calendar right now. Follow us on Luma to hear about the next one.',
  },
} as const
