export interface UserProfile {
  name: string
  email: string
  phone: string
  location: string
  beautyPoints: number
  nextRewardPoints: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
}

export interface Order {
  id: string
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: number
  total: number
  date: string
  image: string
}

export interface Offer {
  title: string
  description: string
  code: string
  discount: number
  image: string
  expiryDate: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedDate?: string
}

export const mockUser: UserProfile = {
  name: 'سارة أحمد',
  email: 'sarah@example.com',
  phone: '0599123456',
  location: 'غزة',
  beautyPoints: 1250,
  nextRewardPoints: 2000,
  tier: 'gold',
}

export const mockOrders: Order[] = [
  { id: 'BZ-001', status: 'processing', items: 3, total: 450, date: '2026-06-10', image: 'https://images.unsplash.com/photo-1522335789203-aabd5f0b9bf4?w=200' },
  { id: 'BZ-002', status: 'shipped', items: 2, total: 280, date: '2026-06-05', image: 'https://images.unsplash.com/photo-1595956553067-3ef228d0ad02?w=200' },
  { id: 'BZ-003', status: 'delivered', items: 5, total: 890, date: '2026-05-28', image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=200' },
]

export const mockOffers: Offer[] = [
  { title: 'تخفيض 20% على NYX', description: 'استخدمي الكود واحصلي على خصم مميز', code: 'NYX20', discount: 20, image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=200', expiryDate: '2026-07-01' },
  { title: 'هدية مجانية مع L\'Oreal', description: 'مع كل طلب بقيمة 300+ شيكل', code: 'GIFT', discount: 0, image: 'https://images.unsplash.com/photo-1595956553067-3ef228d0ad02?w=200', expiryDate: '2026-06-30' },
  { title: 'خصم 15% على المكياج', description: 'على جميع منتجات MAC', code: 'MAC15', discount: 15, image: 'https://images.unsplash.com/photo-1522335789203-aabd5f0b9bf4?w=200', expiryDate: '2026-08-15' },
]

export const mockAchievements: Achievement[] = [
  { id: '1', title: 'أول طلب', description: 'أكملي أول طلب لكِ', icon: '🎉', unlocked: true, unlockedDate: '2026-01-15' },
  { id: '2', title: 'عميلة ذهبية', description: 'أكملي 5 طلبات', icon: '⭐', unlocked: true, unlockedDate: '2026-03-20' },
  { id: '3', title: 'مستكشفة', description: 'جربي 10 منتجات مختلفة', icon: '🔍', unlocked: true, unlockedDate: '2026-04-10' },
  { id: '4', title: 'مخلصة', description: 'تابعينا على Instagram', icon: '📱', unlocked: false },
  { id: '5', title: 'VIP', description: 'أنفقي 2000+ شيكل', icon: '💎', unlocked: false },
]
