// The beach jump photo is shared with the About page.
import beachJump from '@/assets/images/about-1.jpg'
import disciplineDesign from '@/assets/images/discipline-design.jpg'
import disciplineManagement from '@/assets/images/discipline-management.jpg'
import disciplineMarketing from '@/assets/images/discipline-marketing.jpg'
import photo1 from '@/assets/images/students-1.jpg'
import photo2 from '@/assets/images/students-2.jpg'
import photo3 from '@/assets/images/students-3.jpg'
import photo4 from '@/assets/images/students-4.jpg'
import photo5 from '@/assets/images/students-5.jpg'
import photo6 from '@/assets/images/students-6.jpg'
import photo7 from '@/assets/images/students-7.jpg'
import photo8 from '@/assets/images/students-8.jpg'
import photo9 from '@/assets/images/students-9.jpg'

export const students = {
  title: 'For Students',

  welcome: {
    title: 'Hey Bruins!',
    subtitle: 'We’re So Glad You’re Here',
    photos: [
      { src: photo1, alt: 'Members gathered around the table at a Product Space Friendsgiving' },
      { src: photo2, alt: 'Members cheering on a rocky outcrop at sunset' },
      { src: photo3, alt: 'Members in summer dresses lined up on the beach at sunset' },
      { src: photo4, alt: 'Two members smiling together at an evening event' },
      { src: beachJump, alt: 'Members jumping in silhouette against a sunset on the beach' },
      { src: photo5, alt: 'Two members in sunglasses hugging on the beach' },
      { src: photo6, alt: 'A big group of members at a driving range at night' },
      { src: photo7, alt: 'Two members hugging before a formal' },
      { src: photo8, alt: 'Two members making a heart with their hands over the city lights' },
      { src: photo9, alt: 'Members posing under string lights at night' },
    ],
  },

  fellowship: {
    title: 'The Fellowship',
    subtitle: 'How to Get Involved',
    paragraphs: [
      'The fellowship is a year-long program for students with a passion for product. Through workshops, mentorship, and hands-on work with clientele, fellows are able to make themselves truly at home among their peers.',
      'Fellows spend their time in one of three cohorts: Product Management (PM), Product Growth (PG), and Product Design (PD). Each cohort is headed by Leads with prior experience in the field.',
      'We offer a high-growth training curriculum across different product roles, and provide multiple opportunities each year for real-world consulting projects. Product Space at UCLA accepts applications on a yearly basis in the fall. Join us!',
    ],
    disciplines: [
      { title: 'Product Design', image: disciplineDesign },
      { title: 'Product Management', image: disciplineManagement },
      { title: 'Product Marketing', image: disciplineMarketing },
    ],
  },

  faq: {
    title: 'Frequently Asked Questions',
    // TODO: the Paper design has placeholder FAQs. These are drafted from facts elsewhere on the
    // site; confirm or replace them before launch.
    items: [
      {
        question: 'Who can apply?',
        answer: 'Any UCLA student. Any major and any skill level can join, so no prior product experience is needed.',
      },
      {
        question: 'When do applications open?',
        answer: 'We accept applications once a year, in the fall. Start by filling out our interest form.',
      },
      {
        question: 'How long is the fellowship?',
        answer:
          'It’s a year-long program of workshops, mentorship, and real-world consulting projects with clients.',
      },
      {
        question: 'Which cohort should I choose?',
        answer:
          'Pick the role you’re most curious about: product management, product design, or product marketing. Each cohort is headed by Leads with prior experience in the field.',
      },
      {
        question: 'Can I get involved without being a fellow?',
        answer:
          'Yes. All UCLA students, including non-fellows, can join our monthly newsletter and come along to our external events.',
      },
    ],
  },
} as const
