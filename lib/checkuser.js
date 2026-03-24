import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  try {
    const user = await currentUser();
    if (!user) return null;

    // Check by clerkUserId first
    const existingUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });
    if (existingUser) return existingUser;

    // Check by email to avoid duplicate
    const email = user.emailAddresses[0].emailAddress;
    const existingByEmail = await db.user.findUnique({
      where: { email },
    });

    // If found by email, update clerkUserId and return
    if (existingByEmail) {
      return await db.user.update({
        where: { email },
        data: { clerkUserId: user.id },
      });
    }

    // Create fresh user
    return await db.user.create({
      data: {
        clerkUserId: user.id,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
        imageUrl: user.imageUrl || "",
        email,
      },
    });
  } catch (error) {
    console.error("checkUser error:", error.message);
    return null;
  }
};