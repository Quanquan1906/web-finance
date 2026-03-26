import { RegisterForm } from '@/features/auth/ui/RegisterForm';
import { Label } from '@/shared/ui/label';

export function RegisterPage() {
  return (
    <div className="bg-muted/30 grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white px-6 py-8 shadow-sm">
        <Label className="justify-center text-4xl mb-6 font-bold">Đăng ký</Label>
        <RegisterForm />
      </div>
    </div>
  );
}
