import {
  Bot,
  Home,
  LogOut,
  PieChart,
  PiggyBank,
  Receipt,
  Tags,
  User
} from 'lucide-react';

const financeManageItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Giao Dịch',
    url: '/transactions',
    icon: Receipt,
  },
  {
    title: 'Danh Mục',
    url: '/categories',
    icon: Tags,
  },
  {
    title: 'Ngân Sách',
    url: '/budgets',
    icon: PiggyBank,
  },
  {
    title: 'Thống Kê',
    url: '/analytics',
    icon: PieChart,
  },
  {
    title: 'AI / Trợ Lý',
    url: '/assistant',
    icon: Bot,
  },
  
];

const userManageItems = [
  {
    title: 'Tài Khoản',
    url: '/dashboard/account',
    icon: User,
  },
  {
    title: 'Đăng Xuất',
    url: '/logout',
    icon: LogOut,
  }
];

export { financeManageItems, userManageItems };

