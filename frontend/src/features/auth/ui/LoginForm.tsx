import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';

import { useAuthStore } from '@/features/auth/model/store';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

function getErrorMessage(error: unknown): string {
  const fallback = 'Đăng nhập thất bại. Vui lòng thử lại.';

  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response
  ) {
    const data = error.response.data as { detail?: unknown; message?: unknown } | undefined;

    if (typeof data?.message === 'string' && data.message.trim()) {
      return data.message;
    }

    if (typeof data?.detail === 'string' && data.detail.trim()) {
      return data.detail;
    }

    if (Array.isArray(data?.detail) && data.detail.length > 0) {
      const first = data.detail[0];

      if (typeof first === 'string') {
        return first;
      }

      if (
        typeof first === 'object' &&
        first !== null &&
        'message' in first &&
        typeof first.message === 'string'
      ) {
        return first.message;
      }
    }
  }

  return fallback;
}

export function LoginForm() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { redirect?: string };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErr(null);
    setLoading(true);

    try {
      await login({
        email: email.trim(),
        password
      });

      await navigate({
        to: search?.redirect || '/dashboard'
      });
    } catch (error: unknown) {
      setErr(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          disabled={loading}
          className="h-11 rounded-xl border-border bg-background px-4 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-medium">
            Mật khẩu
          </Label>

          <Link to="/login" className="text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline">
            Quên mật khẩu?
          </Link>
        </div>

        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          disabled={loading}
          className="h-11 rounded-xl border-border bg-background px-4 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      {err ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {err}
        </div>
      ) : null}

      <Button
        type="submit"
        className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]"
        disabled={loading}
      >
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </Button>
    </form>
  );
}
