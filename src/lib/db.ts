import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

if (!uri || uri.includes("xxxx.mongodb.net")) {
  console.warn("MONGODB_URI is using a placeholder. Cloud database connections will be bypassed to prevent timeouts.");
}

export async function connectToDatabase() {
  if (!uri || uri.includes("xxxx.mongodb.net")) {
    throw new Error("MONGODB_URI is undefined or using a placeholder. Bypassing database call to prevent server timeouts.");
  }

  if (client && clientPromise) {
    return client;
  }

  try {
    // Configure a highly optimized 5-second fail-fast timeout limit
    client = new MongoClient(uri, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });
    clientPromise = client.connect();
    await clientPromise;
    console.log("Connected successfully to MongoDB Atlas.");
    return client;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}
