export type ComponentStatus = 'operational' | 'degraded' | 'down';

export interface Component {
  id: string;
  name: string;
  type: 'API' | 'Website' | 'Database' | 'Service' | 'CDN' | 'DNS';
  status: ComponentStatus;
  description?: string;
}

export interface Incident {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  components: string[]; // component IDs
  updates: IncidentUpdate[];
  createdAt: number;
  resolvedAt?: number;
}

export interface IncidentUpdate {
  id: string;
  message: string;
  status: Incident['status'];
  timestamp: number;
}

export interface StatusPage {
  slug: string;
  editToken: string;
  name: string;
  description?: string;
  components: Component[];
  incidents: Incident[];
  subscribers: string[];
  createdAt: number;
  updatedAt: number;
  isPro: boolean;
}

export interface UptimeDay {
  date: string;
  uptime: number; // 0-100
  status: ComponentStatus;
}
