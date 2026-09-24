/**
 * Everything that appears in more than one place, or that changes when the
 * site moves. A value used by exactly one component belongs in that component.
 */

export const SITE = {
  url: 'https://alex-ak.com',
  title: 'Alex King',
  description:
    'Staff software engineer at Solace Health in Seattle, mostly backend. Building Pikos: notes, tasks, and calendar in one app.',
  author: 'Alex King',
  locale: 'en',
} as const;

export const NAV = [
  { href: '/writing', label: 'Writing' },
  { href: '/about', label: 'About' },
] as const;

export const EMAIL = 'mailto:hello@alex-ak.com';

export const SOCIALS = [
  { href: 'https://github.com/Alex-AK', label: 'GitHub' },
  { href: 'https://linkedin.com/in/alex-ak', label: 'LinkedIn' },
  { href: EMAIL, label: 'Email' },
] as const;

export const PIKOS = {
  site: 'https://pikos.app',
  repo: 'https://github.com/Pikos-App/pikos',
} as const;

/** Public by design: the id ships in every page's HTML anyway. */
export const ANALYTICS = {
  src: 'https://cloud.umami.is/script.js',
  websiteId: '4ec75dff-25bd-4030-a8e3-2bc92191b7a2',
} as const;
