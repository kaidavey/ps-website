import clientAmazon from '@/assets/images/client-1.png'
import clientAdobe from '@/assets/images/client-2.png'
import clientUber from '@/assets/images/client-3.png'
import clientMicrosoft from '@/assets/images/client-4.png'
import event1 from '@/assets/images/event-1.jpg'
import event2 from '@/assets/images/event-2.jpg'
import event3 from '@/assets/images/event-3.jpg'
import avatarPatrick from '@/assets/images/testimonial-1-avatar.jpg'
import logoAdobe from '@/assets/images/testimonial-1-logo.png'
import avatarNora from '@/assets/images/testimonial-2-avatar.jpg'
import logoMeta from '@/assets/images/testimonial-2-logo.svg'

export const companies = {
  title: 'For Companies',

  overview: {
    title: 'Overview',
    summary:
      'We connect tech companies with top product talent from UCLA to work on high-priority business goals across product management, design and marketing via quarter-long projects.',
    stats: [
      { value: '40+', label: 'Active members' },
      { value: '30+', label: 'Client projects in 5 years' },
      { value: '5.4M', label: 'Social media reach' },
    ],
  },

  clients: {
    label: 'Who We’ve Worked With:',
    logos: [
      { name: 'Amazon', src: clientAmazon },
      { name: 'Adobe', src: clientAdobe },
      { name: 'Uber', src: clientUber },
      { name: 'Microsoft', src: clientMicrosoft },
    ],
  },

  timeline: {
    title: 'Timeline',
    steps: [
      { title: 'Scoping', description: 'Identify the project scope, deliverable, and timeline together on a call' },
      { title: 'Contracting', description: 'Sign contracts: NDA, Statement of Work, fees*' },
      { title: 'Building', description: 'Team kickoff meetings, check-ins and iterate on feedback' },
      { title: 'Delivering', description: 'Present final research, product recommendation, and design' },
    ],
    note: '*Priced by scope and length: $5,000 - $20,000 (negotiable, tax-deductible)',
  },

  testimonials: {
    title: 'Client Testimonies',
    items: [
      {
        company: 'Adobe',
        logo: logoAdobe,
        project: 'Client Project Spring ‘24',
        name: 'Patrick Hoy',
        role: 'Senior Manager',
        avatar: avatarPatrick,
        quote: [
          '"The Product Space team delivered a well-researched and actionable assessment for our team. The problem they tackled was complex, but they managed to deliver clear recommendations that were based in real insight. They brought a cross-functional team to the problem - across marketing, design, product, and program management. Every student we engaged with on this project was fully invested in the work and its success.',
          'The Product Space team felt like an extension of our team. This isn\'t just a student project team - they go above and beyond to ensure the deliverable adds real business value.”',
        ],
      },
      {
        company: 'Meta',
        logo: logoMeta,
        project: 'Client Project Spring ‘24',
        name: 'Nora Hackmann',
        role: 'Former Head of Product Strategy',
        avatar: avatarNora,
        quote: [
          '“I’m so grateful for the partnership with UCLA Product Space - if you can convince the team to work with our organization, you can consider yourself very fortunate!',
          'We had the opportunity to collaborate on a 10-week co-design sprint with this amazing team of aspiring designers, product managers, and product marketers.”',
        ],
      },
    ],
  },

  partnerships: {
    title: 'Alternative Partnerships',
    subtitle: 'If a client project isn’t the right fit, there are other ways to work with us!',
    items: [
      {
        title: 'Speaker & Recruiting Events',
        description:
          'Host a talk, workshop, or info session to connect directly with 40+ product-focused UCLA students or the greater campus community.',
      },
      {
        title: 'Product Competitions',
        description:
          'Sponsor a case competition or hackathon with your brand and prompt in front of hundreds of students.',
      },
    ],
  },

  pastEvents: {
    title: 'Past Events',
    items: [
      { caption: 'Notion x Figma workshop', src: event1, alt: 'Instagram post for the Tools for Builders product workshop' },
      { caption: 'Claude Agent workshop', src: event2, alt: 'Instagram post for the Claude Agent workshop' },
      { caption: 'Activision Blizzard office tour', src: event3, alt: 'Fellows on a tour of the Activision Blizzard offices' },
    ],
  },

  contact: {
    title: 'Let’s Chat',
    subtitle: 'If this sounds interesting, reach out.',
    partnershipTypes: ['Client Project', 'Speaker or Recruiting Event', 'Product Competition', 'Something else'],
    submit: 'Send',
  },
} as const
