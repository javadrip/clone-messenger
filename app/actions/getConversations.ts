import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversations = async () => {
  const currentUser = await getCurrentUser();

  // If user is not logged in, return empty array
  if (!currentUser?.id) {
    return [];
  }

  try {
    // Get all conversations where the current user is a participant
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      // Filter conversations where the current user is a participant, be it 1-1 or group chat
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      // Include the users and messages in each conversation
      include: {
        users: true,
        messages: {
          // sender is the user who sent the message
          // seen is the user who has seen the message
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });

    return conversations;
  } catch (error: any) {
    return [];
  }
};

export default getConversations;
