import dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";
import locale from "./src/utilities/i18n";
import ownerRouter from "./src/routes/owner";

//mongodb connection
import "./src/databases/mongo/connection";
import agentRouter from "./src/routes/agent";
import companyRouter from "./src/routes/company";
import teamRouter from "./src/routes/team";
import cors from "cors";
import managerRouter from "./src/routes/manager";
import { createServer } from "http";
import jobRouter from "./src/routes/job";
import commonRouter from "./src/routes/common";
import swaggerSetup from "./src/swagger";

const app: Express = express();

const httpServer = createServer(app);

app.use(
  cors({
    origin: "*",
  }),
);

app.use(express.json());

//use locale - default language is english
app.use(locale);

// use routers
app.use("/owner", ownerRouter);
app.use("/agent", agentRouter);
app.use("/company", companyRouter);
app.use("/team", teamRouter);
app.use("/manager", managerRouter);
app.use("/job", jobRouter);
app.use("/common", commonRouter);

// use swagger
swaggerSetup(app);

app.use(express.static("public"));

const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
  console.info(`✅ [Server]: Server is running at ${PORT}  ✅`);
});
