import { Link } from '@tanstack/react-router';

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen flex-1 bg-background">
    <h1 className="text-4xl font-bold mb-4 text-foreground">
      404 - Trang không tồn tại
    </h1>
    <p className="mb-6 text-muted-foreground">
      Rất tiếc trang bạn tìm không được tìm thấy.
    </p>
    <Link to="/" className="text-sm">
      <span className="inline-block px-6 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer">
        Trở về trang chính
      </span>
    </Link>
  </div>
  );
}
