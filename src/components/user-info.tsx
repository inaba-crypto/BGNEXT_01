import { auth } from "@/auth";
import { SignIn } from "./sign-in";
import { SignOut } from "./sign-out";

export async function UserInfo() {
  const session = await auth();

  if (!session?.user) {
    return <SignIn />;
  }

  return (
    <div className="flex items-center gap-4">
      {session.user.image && (
        <img
          src={session.user.image}
          alt={session.user.name ?? "ユーザー"}
          className="h-10 w-10 rounded-full"
        />
      )}
      <div>
        <p className="font-medium">{session.user.name}</p>
        <p className="text-sm text-gray-500">{session.user.email}</p>
      </div>
      <SignOut />
    </div>
  );
}
