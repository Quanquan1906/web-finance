import { createFileRoute } from '@tanstack/react-router';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

export const Route = createFileRoute('/(auth)/_auth/login')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div className="flex items-center justify-center">
      <Card className="w-115 rounded-2xl border border-none bg-slate-100 shadow-none">
        <CardHeader className="text-center">
          <div className="mb-2 flex items-center justify-center space-x-2">
            <img src="aiaivn.png" alt="Logo" className="h-8 w-8 rounded-full" />
            <span className="text-lg font-semibold text-slate-700">AIAIVN</span>
          </div>
          <CardTitle className="text-xl text-slate-700">Nice to see you again</CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={() => {}} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input type="text" placeholder="Enter email or phone" className="mt-2" />
            </div>
            <div className="relative">
              <Label className="">Password</Label>
              <Input placeholder="Enter password" className="mt-2" />
              <div className="mt-1 text-right">
                <a href="#" className="text-sm font-medium text-gray-600 hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Signin
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2">
          <p className="text-muted-foreground mt-2 text-xs">© AIAIVN 2025</p>
        </CardFooter>
      </Card>
    </div>
  );
}
