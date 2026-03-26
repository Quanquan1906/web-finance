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
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm">
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
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm">
            Mật khẩu
          </Label>

          <Link to="/login" className="text-muted-foreground text-sm hover:underline">
            Quên mật khẩu
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
        />
      </div>

      {err ? <p className="text-sm text-red-500">{err}</p> : null}

      <Button type="submit" className="w-full rounded-xl" disabled={loading}>
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </Button>
    </form>
  );
}
