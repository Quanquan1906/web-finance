import { useState } from "react";
import { useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useAuthStore } from "@/features/auth/model/store";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

export function LoginForm() {
  const login = useAuthStore((s) => s.login);
  const nav = useNavigate();
  const search = useSearch({ strict: false }) as { redirect?: string };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login({ email, password });
      nav({ to: search?.redirect || "/dashboard" });
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm">Username hoặc Email</Label>
        <Input
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm">Mật khẩu</Label>

          {/* Bạn chưa có trang này thì để '#' hoặc tạo route sau */}
          <Link
            to="/login"
            className="text-sm text-muted-foreground hover:underline"
          >
            Quên mật khẩu
          </Link>
        </div>

        <Input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>

      {err ? <p className="text-sm text-red-500">{err}</p> : null}

      <Button type="submit" className="w-full rounded-xl" disabled={loading}>
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>
    </form>
  );
}
