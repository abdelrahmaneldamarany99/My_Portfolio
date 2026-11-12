import type { ProfileData, Project, Ticket, Commit, ArchitectureDoc } from '../types/index.ts';

export const fallbackProfile: ProfileData = {
  name: 'Abdelrahman Eldamarany',
  title: 'Senior React / Next.js / MERN Full-Stack Developer',
  location: 'Cairo, Egypt',
  email: 'abdelrahmaneldamarany99@gmail.com',
  phone: '+02-01111295894',
  linkedin: 'https://linkedin.com/in/abdelrahman-eldamarany/',
  github: [
    'https://github.com/abdelrahmaneldamarany99',
    'https://github.com/abdelrahman-capital-numbers',
  ],
  summary:
    'Senior React / Next.js / Full-Stack (MERN) Developer with 7+ years of experience building responsive, scalable, and maintainable web applications using React, Next.js, TypeScript, Node.js, Express.js, and MongoDB. Strong experience in frontend architecture, reusable component development, state management, RESTful API integration, performance optimization, responsive UI development, and end-to-end feature delivery. Additionally possesses hands-on experience in Machine Learning, Deep Learning, and AI.',
  stats: {
    yearsExperience: '7+',
    mlExperience: '3+',
    completedProjects: '12+',
    architectureType: 'MERN & Next.js',
  },
};
