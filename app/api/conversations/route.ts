import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { userId, isGroup, members, name } = body;

    // Check if user is logged in
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    // Check if userId is provided
    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    // Check if conversation already exists
    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              // Add current user to group because current user was excluded from members
              {
                id: currentUser.id,
              },
            ],
          },
        },
        // By default, Prisma does not return the array of user objects
        // If we need to work with the users' data (e.g. display their names, avatars, etc.), we need to include them
        include: {
          users: true,
        },
      });

      return NextResponse.json(newConversation);
    }

    // Check if conversation already exists
    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            // Check if conversation exists between current user and selected user
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            // Check if conversation exists between selected user and current user
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });

    const singleConversation = existingConversations[0];

    // If conversation already exists, return it
    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    return NextResponse.json(newConversation);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
