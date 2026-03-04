export interface Task {
  id: string;
  name: string;
  group: string;
  notes?: string;
  lastCompleted?: string;
  reminderEnabled: boolean;
  createdAt: string;
}

export interface Settings {
  email: string;
  reminderFrequency: 'weekly' | 'monthly';
  lastReminderSent?: string;
}

export const GROUPS = [
  'A-Frame House',
  'Garage & Shop',
  'Grounds & Outdoor',
  'Ford F-250',
  'Chevy Traverse',
] as const;

export const GROUP_ICONS: Record<string, string> = {
  'A-Frame House': '🏠',
  'Garage & Shop': '🔧',
  'Grounds & Outdoor': '🌲',
  'Ford F-250': '🛻',
  'Chevy Traverse': '🚙',
};

export const GROUP_DESCRIPTIONS: Record<string, string> = {
  'A-Frame House': 'Propane furnace, wood stove, 2 bath, kitchen, laundry, screened porch',
  'Garage & Shop': '2-car garage, shop, wood stove, 3-season attic',
  'Grounds & Outdoor': 'Greenhouse, dock, watercraft, driveway, grounds',
  'Ford F-250': '200K miles, upgraded shocks & interior',
  'Chevy Traverse': 'Family vehicle, grandkid safety, winter prep',
};

export const GROUP_COLORS: Record<string, { bg: string; border: string; accent: string; light: string }> = {
  'A-Frame House': { bg: '#fef3c7', border: '#f59e0b', accent: '#d97706', light: '#fffbeb' },
  'Garage & Shop': { bg: '#e0e7ff', border: '#6366f1', accent: '#4f46e5', light: '#eef2ff' },
  'Grounds & Outdoor': { bg: '#d1fae5', border: '#10b981', accent: '#059669', light: '#ecfdf5' },
  'Ford F-250': { bg: '#fee2e2', border: '#ef4444', accent: '#dc2626', light: '#fef2f2' },
  'Chevy Traverse': { bg: '#dbeafe', border: '#3b82f6', accent: '#2563eb', light: '#eff6ff' },
};
