import { Schema, model, connect } from "mongoose";
const MONGO_DB_URI = process.env.MONGO_DB_URI || "";

run().catch((error) => {
  if (error) {
    console.error(
      `❌ [Database Mongo]: connection has been not establish  ❌ : ` + error,
    );
    return;
  } else {
    console.info(
      `✅ [Database Mongo]: connection has been established successfull ✅`,
    );
  }
});

async function run() {
  // 4. Connect to MongoDB
  await connect(MONGO_DB_URI);
}
