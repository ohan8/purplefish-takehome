"use client";

import { MessageType } from "@prisma/client";
import Link from "next/link";
import ArrowUpIcon from "~/app/_components/icons/ArrowUpIcon";
import SettingsIcon from "~/app/_components/icons/SettingsIcon";
import UserIcon from "~/app/_components/icons/UserIcon";
import AIResponse from "~/components/AIResponse";
import { Button } from "~/components/ui/button";
import UserMessage from "~/components/UserMessage";

import { useState } from "react";
import useChats from "./hooks/useChats";

export default function ChatPage({ params }: { params: { id: string } }) {
  const [chatId, setChatId] = useState<string | undefined>(
    params.id ? params.id[0] : undefined,
  );

  const {
    conversations,
    router,
    messages,
    showStream,
    stream,
    input,
    handleInputChange,
    onFormSubmit,
  } = useChats({ chatId, setChatId });

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
              <Link href="/chats">
                <Button
                  variant={chatId === undefined ? "default" : "ghost"}
                  className="justify-start gap-2 rounded-md px-3 py-2"
                  type="submit"
                  onClick={() => setChatId(undefined)}
                >
                  <div className="text-sm font-medium">New Chat</div>
                </Button>
              </Link>

              {conversations.map((c: any) => {
                return (
                  <Button
                    key={c.id}
                    variant={chatId === c.id ? "default" : "ghost"}
                    className="justify-start gap-2 rounded-md px-3 py-2"
                    onClick={() => router.push(`/chats/${c.id}`)}
                  >
                    <div className="text-sm font-medium">{c.title}</div>
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <div className="grid gap-4">
            {messages.map((m) => (
              <div key={m.id} className="whitespace-pre-wrap">
                {m.type === MessageType.USER ? (
                  <UserMessage content={m.content} />
                ) : (
                  <AIResponse content={m.content} />
                )}

                {/* {m.toolInvocations?.map((toolInvocation: ToolInvocation) => { */}
                {/*   const toolCallId = toolInvocation.toolCallId; */}
                {/*   const addResult = (result: string) => */}
                {/*     addToolResult({ toolCallId, result }); */}
                {/**/}
                {/*   // render confirmation tool (client-side tool with user interaction) */}
                {/*   if (toolInvocation.toolName === "askForConfirmation") { */}
                {/*     return ( */}
                {/*       <div key={toolCallId}> */}
                {/*         {toolInvocation.args.message} */}
                {/*         <div> */}
                {/*           {"result" in toolInvocation ? ( */}
                {/*             <b>{toolInvocation.result}</b> */}
                {/*           ) : ( */}
                {/*             <> */}
                {/*               <button onClick={() => addResult("Yes")}> */}
                {/*                 Yes */}
                {/*               </button> */}
                {/*               <button onClick={() => addResult("No")}> */}
                {/*                 No */}
                {/*               </button> */}
                {/*             </> */}
                {/*           )} */}
                {/*         </div> */}
                {/*       </div> */}
                {/*     ); */}
                {/*   } */}
                {/**/}
                {/*   return null; */}
                {/*   // other tools: */}
                {/*   return "result" in toolInvocation ? ( */}
                {/*     <div key={toolCallId}> */}
                {/*       Tool call {`${toolInvocation.toolName}: `} */}
                {/*       {toolInvocation.result} */}
                {/*     </div> */}
                {/*   ) : ( */}
                {/*     <div key={toolCallId}> */}
                {/*       Calling {toolInvocation.toolName}... */}
                {/*     </div> */}
                {/*   ); */}
                {/* })} */}
              </div>
            ))}
            {showStream && <AIResponse content={stream} />}
          </div>
        </div>
      </div>
      <div className="bg-background border-t px-6 py-4">
        <div className="relative">
          <form onSubmit={onFormSubmit}>
            <input
              value={input}
              placeholder={"Type your message..."}
              onChange={handleInputChange}
              className="shadow-settimeout min-h-[48px] w-full resize-none rounded-2xl border border-neutral-400 p-4 pr-16"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-3 top-3 flex h-8 w-8"
            >
              <ArrowUpIcon className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
