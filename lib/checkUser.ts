import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const checkUser = async () => {
    const user = await currentUser();

    // Check for current logged in clerk user

    if (!user) {
        return null;
    }

    // Check if user is already in the DB
    const loggedInUser = await db.user.findUnique({
        where: {
            clerkUserId: user.id
        }
    });

    // If user is in DB, return user
    if (loggedInUser) {
        return loggedInUser;
    }

    const newUser = await db.user.create({
        data: {
            clerkUserId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress
        }
    });
    return newUser;
};