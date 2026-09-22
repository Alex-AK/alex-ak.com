/**
 * Everything that appears in more than one place, or that changes when the
 * site moves. A value used by exactly one component belongs in that component.
 */

export const SITE = {
  url: 'https://alex-ak.com',
  title: 'Alex King',
  description:
    'Staff software engineer in Seattle. Product, mostly backend. Building Pikos.',
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

/** Umami is self-service and cookie-free, so the id is public by design. */
export const ANALYTICS = {
  src: 'https://cloud.umami.is/script.js',
  websiteId: '4ec75dff-25bd-4030-a8e3-2bc92191b7a2',
} as const;
