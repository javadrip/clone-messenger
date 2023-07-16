import { useParams } from "next/navigation";
import { useMemo } from "react";

const useConversation = () => {
  const params = useParams();

  const conversationId = useMemo(() => {
    // Check if params is undefined
    // Chaining operator ?. allows safely accessing nested properties without throwing an error if any intermediate property is nullish or undefined.
    // !params?.conversationId evaluates to true if it is undefined, null or empty.
    if (!params?.conversationId) {
      return "";
    }

    return params.conversationId as string;
  }, [params?.conversationId]);

  // Double bang to convert isOpen to boolean
  const isOpen = useMemo(() => !!conversationId, [conversationId]);

  return useMemo(
    () => ({
      isOpen,
      conversationId,
    }),
    [isOpen, conversationId]
  );
};

export default useConversation;
