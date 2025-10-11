import type { ReactNode } from 'react';

export interface NavBadge {
  text: string;
  color: 'red' | 'blue' | 'green' | 'yellow' | 'gray';
}

export interface NavItem {
  label: string;
  icon: ReactNode;
  href: string;
  active: boolean;
  badge?: NavBadge;
  children?: NavItem[];
}

export interface MenuSection {
  id: string;
  label: string;
  items: NavItem[];
}
