"use server";

import { Client, Account, Databases, Storage, Avatars } from "node-appwrite";
import { cookies } from "next/headers";




const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const END_POINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const API_KEY = process.env.NEXT_APPWRITE_KEY;


export const createSessionClient = async () => {
  try {
    const client = new Client()
    .setEndpoint(END_POINT)
    .setProject(PROJECT_ID)
    

    const session = (await cookies()).get("appwrite-session");

    if (!session || !session.value){
         throw new Error('No session')
    }
    client.setSession(session.value);

    return {
      account: new Account(client),
      databases: new Databases(client),
    };
  } catch (error) {
    console.error("createSessionClient error:", error);
    return null; 
  }
};

export const createAdminClient = async () => {
  
  if (!API_KEY || !END_POINT || !PROJECT_ID) {
    throw new Error("Appwrite Admin credentials are missing in environment variables");
  }
  

  try {
    const client = new Client()
      .setEndpoint(END_POINT)
      .setProject(PROJECT_ID)
      .setKey(API_KEY)

    return {
      account: new Account(client),
      databases: new Databases(client),
      storage: new Storage(client),
      avatars: new Avatars(client),
    };
  } catch (error) {
    console.error("createAdminClient error:", error);
    return {
      account: undefined,
      databases: undefined,
      storage: undefined,
      avatars: undefined,
    };
  }
};
