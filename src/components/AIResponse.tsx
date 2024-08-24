import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export default function AIResponse({ content }: { content: string }) {
  return (
    <div className="flex items-start gap-4">
      <Avatar className="h-8 w-8 border">
        <AvatarImage src="/placeholder-user.jpg" alt="Image" />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
      <div className="bg-muted grid max-w-[80%] gap-1 rounded-lg p-3">
        <div className="font-medium">ChatGPT</div>
        <div className="text-sm">
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
}
