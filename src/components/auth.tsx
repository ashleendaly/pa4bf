import { getSession } from "@auth0/nextjs-auth0";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

function Login() {
  return (
    <Button>
      <a href="/api/auth/login">Login</a>
    </Button>
  );
}

function Logout() {
  return (
    <Button variant="ghost">
      <a href="/api/auth/logout">Logout</a>
    </Button>
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
