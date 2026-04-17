import { Link } from '@tanstack/react-router';
import { RegisterForm } from '@/features/auth/ui/RegisterForm';
import { TrendingUp } from 'lucide-react';

export function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <TrendingUp className="h-5 w-5" />
        </div>
        <span className="text-lg font-bold text-foreground">FinTrack AI</span>
      </div>

      <div className="w-full max-w-sm space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Tạo tài khoản mới</h1>
        <p className="text-sm text-muted-foreground">
          Miễn phí và không cần thẻ tín dụng
        </p>
      </div>

      <div className="mt-8 w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm">
        <RegisterForm />
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Đã có tài khoản?{' '}
        <Link to="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
