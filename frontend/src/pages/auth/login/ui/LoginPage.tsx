import { LoginForm } from "@/features/auth/ui/LoginForm";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";

export function LoginPage() {
  return (
    <div className="min-h-screen bg-muted/30 grid place-items-center p-6">
      <Card className="w-full max-w-md rounded-2xl shadow-sm">
        <CardHeader className="space-y-3 pb-2">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-cyan-200">
            <span className="text-3xl">🧑‍💻</span>
          </div>

          <div className="text-center space-y-1">
            <Label className="text-xl justify-center font-semibold">Đăng nhập tài khoản</Label>
            <p className="text-sm  text-muted-foreground">
              Nhập Email và Password để đăng nhập vào hệ thống
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
 