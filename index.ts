import dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";
import locale from "./src/utilities/i18n";
import ownerRouter from "./src/routes/owner";

//mongodb connection
import "./src/databases/mongo/connection";
import agentRouter from "./src/routes/agent";
import ownerCompanyRouter from "./src/routes/ownerCompany";

const app: Express = express();

app.use(express.json());

//use locale - default language is english
app.use(locale);

// use routers
app.use("/owners", ownerRouter);
app.use("/agents", agentRouter);
app.use("/companies", ownerCompanyRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.info(`✅ [Server]: Server is running at ${PORT}  ✅`);
});
