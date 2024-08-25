import { MessageType } from "@prisma/client";
import { useChat } from "ai/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";

export default function useChats({
  chatId,
  setChatId,
}: {
  chatId: string | undefined;
  setChatId: (chatId: string | undefined) => void;
}) {
  const router = useRouter();
  const [stream, setStream] = useState<string | undefined>(undefined);

  // Queries
  const { data: conversationsData } = api.conversation.getAll.useQuery();
  const conversations = conversationsData ?? [];

  const { data: messagesData } = api.conversation.getMessages.useQuery({
    conversationId: chatId ?? "",
  });
  const messages = messagesData ?? [];

  // mutations
  const utils = api.useUtils();

  const createConversation = api.conversation.create.useMutation({
    onSuccess: async (conversation) => {
      setChatId(conversation.id);
      await utils.conversation.invalidate();
    },
  });

  const addMessage = api.conversation.addMessage.useMutation({
    onSuccess: async () => {
      await utils.conversation.invalidate();
      setStream(undefined);
    },
  });

  const {
    messages: chatHookMessages,
    input,
    handleInputChange,
    handleSubmit,
  } = useChat({
    maxToolRoundtrips: 5,
    id: chatId,
    initialMessages: messages.map((m) => {
      return {
        id: m.id,
        content: m.content,
        role: m.type === MessageType.USER ? "user" : "assistant",
      };
    }),
    onFinish: async (result) => {
      if (!result || !result.content || !chatId) {
        return;
      }

      addMessage.mutate({
        conversationId: chatId,
        content: result.content,
        type: MessageType.AI,
      });
    },
  });

  // use effect to handle initial submit when new conversation is made
  useEffect(() => {
    if (chatId && input) {
      handleSubmit();
    }
  }, [chatId]);

  // Used to stream the AI response
  const showStream =
    !!stream && messages[messages.length - 1]?.type == MessageType.USER;

  useEffect(() => {
    const aiStream = chatHookMessages.filter((m) => m.role === "assistant");
    const lastAssistantRoleHookMessage = aiStream[aiStream.length - 1];
    console.log("last message is:", lastAssistantRoleHookMessage);
    setStream(lastAssistantRoleHookMessage?.content);
  }, [chatHookMessages.length]);

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chatId) {
      createConversation.mutate({ title: input });
    } else {
      addMessage.mutate({
        conversationId: chatId,
        content: input,
        type: MessageType.USER,
      });
      handleSubmit();
    }
  };

  return {
    conversations,
    router,
    messages,
    showStream,
    stream,
    chatHookMessages,
    input,
    handleInputChange,
    handleSubmit,
    setStream,
    onFormSubmit,
  };
}
