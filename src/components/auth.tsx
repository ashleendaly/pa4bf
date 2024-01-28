import { getSession } from "@auth0/nextjs-auth0";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Link from "next/link";

export function Login() {
  return (
    <Link href="/api/auth/login">
      <Button>Login</Button>
    </Link>
  );
}

function Logout() {
  return (
    <Link href="/api/auth/logout">
      <Button variant="ghost">Logout</Button>
    </Link>
  );
}

export async function UserButton() {
  const session = await getSession();
  if (!session) return <Login />;

  return (
    <Popover>
      <PopoverTrigger>
        <Avatar>
          <AvatarImage src={(session.user.picture as string) ?? ""} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <Logout />
      </PopoverContent>
    </Popover>
  );
}

// ? this should probably be in lib
export async function getUserId() {
  const session = await getSession();
  if (!session) return undefined;
  return session.user.email as string | undefined;
}
