import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex items-start justify-end gap-4">
      <div className="bg-primary text-primary-foreground grid max-w-[80%] gap-1 rounded-lg p-3">
        <div className="font-medium">You</div>
        <div className="text-sm">
          <p>{content}</p>
        </div>
      </div>
      <Avatar className="h-8 w-8 border">
        <AvatarImage src="/placeholder-user.jpg" alt="Image" />
        <AvatarFallback>ME</AvatarFallback>
      </Avatar>
    </div>
  );
}
