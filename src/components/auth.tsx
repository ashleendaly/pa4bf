import { getSession } from "@auth0/nextjs-auth0";

export function Login() {
  return <a href="/api/auth/login">Login</a>;
}

export default function Logout() {
  return <a href="/api/auth/logout">Logout</a>;
}

export async function AuthButton() {
  const session = await getSession();
  const Auth = session ? Logout : Login;
  return <Auth />;
}
