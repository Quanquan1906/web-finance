import { Link } from "@tanstack/react-router";

import { LoginForm } from "@/features/auth/ui/LoginForm";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";

export function LoginPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-muted/30 p-6">
      <Card className="w-full max-w-md rounded-2xl shadow-sm">
        <CardHeader className="space-y-3 pb-2">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-cyan-200">
            <span className="text-3xl">🧑‍💻</span>
          </div>

          <div className="space-y-1 text-center">
            <Label className="justify-center text-xl font-semibold">
              Đăng nhập tài khoản
            </Label>
            <p className="text-sm text-muted-foreground">
              Nhập Email và Password để đăng nhập vào hệ thống
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <LoginForm />

          <p className="text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}