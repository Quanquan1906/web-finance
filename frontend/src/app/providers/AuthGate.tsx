import { useEffect } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const routerState = useRouterState();

  useEffect(() => {
    const handler = (e: Event) => {
      // lear local auth
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      alert("Phiên đăng nhập đã hết hạn");
      // lưu lại url hiện tại để login xong quay về
      const currentHref = routerState.location.href;

      navigate({
        to: "/login",
        search: { redirect: currentHref },
        replace: true,
      });
    };

    window.addEventListener("auth:unauthorized", handler);
    return () => window.removeEventListener("auth:unauthorized", handler);
  }, [navigate, routerState.location.href]);

  return <>{children}</>;
}
