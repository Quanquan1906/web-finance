import {
  Bell,
  Bot,
  Home,
  LogOut,
  PieChart,
  Receipt,
  Settings2,
  Tags,
  User
} from 'lucide-react';

const financeManageItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
    children: [],
    roles: []
  },
  {
    title: 'Giao Dịch',
    url: '/transactions',
    icon: Receipt,
    roles: [],
    children: []
  },
  {
    title: 'Danh Mục',
    url: '/categories',
    icon: Tags,
    children: [],
    roles: []
  },
  {
    title: 'Thống Kê',
    url: '/analytics',
    icon: PieChart,
    children: [],
    roles: []
  },
  {
    title: 'AI / Trợ Lý',
    url: '/assistant',
    icon: Bot,
    roles: [],
    children: []
  },
  {
    title: 'Cài Đặt',
    url: '/dashboard/settings',
    icon: Settings2,
    roles: [],
    children: [
      {
        title: 'Thông báo',
        url: '/dashboard/settings/notifications',
        icon: Bell,
        roles: []
      }
    ]
  }
];

const userManageItems = [
  {
    title: 'Tài Khoản',
    url: '/dashboard/account',
    icon: User,
    roles: [],
    children: []
  },
  {
    title: 'Đăng Xuất',
    url: '/logout',
    icon: LogOut,
    roles: [],
    children: []
  }
];

export { financeManageItems, userManageItems };

