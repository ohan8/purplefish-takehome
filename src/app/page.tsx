import Link from "next/link";

import { Button } from "~/components/ui/button";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  void api.conversation.getLatest.prefetch();
  void api.conversation.getAll.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-bold tracking-tight sm:text-[5rem]">
            Welcome to an awesome{" "}
            <span className="text-[hsl(280,100%,70%)]">Chat App</span>
          </h1>
          <Link href="/chats">
            <Button>Start Chatting</Button>
          </Link>
        </div>
      </main>
    </HydrateClient>
  );
}
