import { Link } from "@tanstack/react-router";

import { LoginForm } from "@/features/auth/ui/LoginForm";
import { TrendingUp } from "lucide-react";

export function LoginPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left panel — Branding */}
      <div className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex lg:w-105">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
            <TrendingUp className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold">FinTrack AI</span>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-bold leading-snug">
            Kiểm soát tài chính cá nhân của bạn
          </h2>
          <p className="text-sm leading-relaxed text-primary-foreground/80">
            Theo dõi thu chi, phân tích xu hướng và lên kế hoạch tài chính thông minh hơn với sự hỗ trợ của AI.
          </p>
        </div>

        <p className="text-xs text-primary-foreground/60">© 2025 FinTrack AI. All rights reserved.</p>
      </div>

      {/* Right panel — Login form */}
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <TrendingUp className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold">FinTrack AI</span>
        </div>

        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Chào mừng trở lại
            </h1>
            <p className="text-sm text-muted-foreground">
              Nhập thông tin đăng nhập để tiếp tục
            </p>
          </div>

          <LoginForm />

          <p className="text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Đăng ký miễn phí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
