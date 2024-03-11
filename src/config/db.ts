import mongoose from "mongoose";

import dotenv from "dotenv";

dotenv.config();

const  connectionString = process.env.MONGO_URL || "mongodb://localhost:21017/nodejs";

/**
 * Connects to the MongoDB database using the provided connection string.
 * 
 * @returns A Promise that resolves when the connection is successful, or rejects with an error if the connection fails.
 */
export const db = mongoose.connect(connectionString)
                                .then(
                                    () => console.log("Connected to MongoDB") 
                                )
                                .catch(     
                                    (err) => console.log(err)
                                ); 