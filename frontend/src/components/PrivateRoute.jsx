import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function PrivateRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  if (token) return children;
  const slug = localStorage.getItem("lastSlug");
  return <Navigate to={slug ? `/login/${slug}` : "/login"} replace />;
}
