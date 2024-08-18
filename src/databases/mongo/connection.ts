import { Schema, model, connect } from "mongoose";
const MONGO_DB_URI = process.env.MONGO_DB_URI || "";

(async () => {
  try {
    await connect(MONGO_DB_URI);
    console.log(
      `✅ [Database Mongo]: connection has been established successfull ✅`,
    );
  } catch (error) {
    console.error(
      `❌ [Database Mongo]: connection has been not establish  ❌ : ` + error,
    );
  }
})();
