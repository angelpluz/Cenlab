import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import { getSafeRedirectPath, getSessionFromCookies } from "@/lib/auth";

type LoginPageProps = {
  searchParams?: {
    next?: string;
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const nextPath = getSafeRedirectPath(searchParams?.next);
  const session = getSessionFromCookies();

  if (session) {
    redirect(nextPath);
  }

  return <LoginForm nextPath={nextPath} />;
}
