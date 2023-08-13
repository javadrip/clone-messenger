import EmptyState from "@/app/components/EmptyState";

import getMessages from "@/app/actions/getMessages";
import getConversationById from "@/app/actions/getConversationsById";

interface IParams {
  conversationId: string;
}

const ChatId = async ({ params }: { params: IParams }) => {
  const conversation = await getConversationById(params.conversationId);
  const messages = await getMessages(params.conversationId);

  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">Header!</div>
    </div>
  );
};

export default ChatId;
