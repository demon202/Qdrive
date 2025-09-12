"use server";
import { createAdminClient, createSessionClient } from "@/lib/appwrite/appwrite";
import { Query, ID, Databases } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";
import { avatarPlaceholderUrl } from "@/app/constants";
import { redirect } from "next/navigation";

const DATABASE_ID= process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
const USER_COLLECTION_ID= process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION;


const getUserByEmail = async (email) => {
  const adminClient = await createAdminClient();
  if (!adminClient) throw new Error("Failed to initialize admin client");
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    DATABASE_ID,
    USER_COLLECTION_ID,
    [Query.equal("email", [email])]
  );

  return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error, message) => {
  console.log(error, message);
  throw error;
};

export const sendEmailOTP = async ({ email }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
};

export const createAccount = async ({ fullName, email }) => {
  const existingUser = await getUserByEmail(email);

  const accountId = await sendEmailOTP({ email });
  if (!accountId) throw new Error("Failed to send an OTP");

  if (!existingUser) {
    const { databases } = await createAdminClient();

    await databases.createDocument(
      DATABASE_ID,
      USER_COLLECTION_ID,
      ID.unique(),
      {
        fullName,
        email,
        avatar: avatarPlaceholderUrl,
        accountId: accountId,
      }
    );
  }

  return {accountId};
};

export const verifySecret = async ( { accountId, password }) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, password);
    //nextjs
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
};

export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient();

    const result = await account.get();

    const user = await databases.listDocuments(
      DATABASE_ID,
      USER_COLLECTION_ID,
      [Query.equal("accountId", result.$id)]
    );

    if (user.total <= 0) return null;

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();

  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Failed to sign out user");
  } finally {
    redirect("/sign-in");
  }
};

export const signInUser = async ({ email }) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({ accountId: existingUser.accountId });
    }

    return parseStringify({ accountId: null, error: "User not found" });
  } catch (error) {
    handleError(error, "Failed to sign in user");
  }
};
