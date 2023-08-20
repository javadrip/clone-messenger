"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { format } from "date-fns";
import clsx from "clsx";

import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";

import { FullConversationType } from "@/app/types";

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  console.log(data.id);

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data.id, router]);

  // Fetch the last message sent in the conversation
  const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1];
  }, [data.messages]);

  // Get the email of the current user
  const userEmail = useMemo(
    () => session.data?.user?.email,
    [session.data?.user?.email]
  );

  // Check if the current user has seen the last message
  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    // || [] is a fallback in case seen is null, so that we can use the filter function later without errors, because filter cannot be used with undefined
    const seenArray = lastMessage.seen || [];

    // Checks if there's userEmail to ensure there is value to be compared later (i.e. user.email === userEmail)
    if (!userEmail) {
      return false;
    }

    // seenArray holds all the users who have seen the message sent
    // If the current user's email is in the seenArray, then the current user has seen the message
    // .length !== 0 is used to convert the result of the filter function to a boolean
    return seenArray.filter(user => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  // Checks the format of the last message sent (i.e. whether the message was an image or text)
  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an image";
    }

    if (lastMessage?.body) {
      return lastMessage?.body;
    }

    return "Started a conversation";
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `
        w-full
        relative
        flex
        items-center
        space-x-3
        p-3
        hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
        `,
        selected ? "bg-neutral-100" : "bg-white"
      )}
    >
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={otherUser} />
      )}

      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-medium text-gray-900">
              {data.name || otherUser.name}
            </p>
            {lastMessage?.createdAt && (
              <p
                className="
                  text-xs
                  text-gray-400
                  font-light
                "
              >
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `
              truncate
              text-sm
              `,
              hasSeen ? "text-gray-500" : "text-black font-medium"
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
