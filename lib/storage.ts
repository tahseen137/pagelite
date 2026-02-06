import { StatusPage, ComponentStatus } from './types';

const STORAGE_KEY = 'pagelite_pages';

export function generateSlug(): string {
  return Math.random().toString(36).substring(2, 8);
}

export function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Client-side storage (for MVP)
export function getAllPages(): StatusPage[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getPageBySlug(slug: string): StatusPage | null {
  const pages = getAllPages();
  return pages.find(p => p.slug === slug) || null;
}

export function getPageByToken(token: string): StatusPage | null {
  const pages = getAllPages();
  return pages.find(p => p.editToken === token) || null;
}

export function savePage(page: StatusPage): void {
  const pages = getAllPages();
  const index = pages.findIndex(p => p.slug === page.slug);
  
  if (index >= 0) {
    pages[index] = { ...page, updatedAt: Date.now() };
  } else {
    pages.push(page);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
}

export function createPage(name: string): StatusPage {
  const page: StatusPage = {
    slug: generateSlug(),
    editToken: generateToken(),
    name,
    components: [],
    incidents: [],
    subscribers: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isPro: false,
  };
  
  savePage(page);
  return page;
}

export function mockUptimeData(days: number = 90) {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Mock: 95-100% uptime, occasional dips
    const uptime = Math.random() > 0.9 ? Math.random() * 10 + 90 : 100;
    const status = uptime === 100 ? 'operational' : uptime > 95 ? 'degraded' : 'down';
    
    data.push({
      date: date.toISOString().split('T')[0],
      uptime: Math.round(uptime * 100) / 100,
      status: status as ComponentStatus,
    });
  }
  
  return data;
}
