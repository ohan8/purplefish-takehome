/**
 * v0 by Vercel.
 * @see https://v0.dev/t/dTZt3fWpjfq
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import SettingsIcon from "~/app/_components/icons/SettingsIcon";
import UserIcon from "~/app/_components/icons/UserIcon";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex h-screen flex-col">
      <header className="bg-primary text-primary-foreground flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold">Chat App</h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <SettingsIcon className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
          <Button variant="ghost" size="icon">
            <UserIcon className="h-5 w-5" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="bg-muted flex w-64 flex-col border-r">
          <div className="border-b p-4">
            <h2 className="text-lg font-medium">Chats</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <nav className="grid gap-2 p-4">
              <>
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
              </>
            </nav>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <div className="grid gap-4">
            <div className="flex items-start justify-end gap-4">
              <div className="bg-primary text-primary-foreground grid max-w-[80%] gap-2 rounded-lg p-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="flex items-start gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="bg-muted grid max-w-[80%] gap-2 rounded-lg p-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
            <div className="flex items-start justify-end gap-4">
              <div className="bg-primary text-primary-foreground grid max-w-[80%] gap-2 rounded-lg p-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="flex items-start gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="bg-muted grid max-w-[80%] gap-2 rounded-lg p-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
