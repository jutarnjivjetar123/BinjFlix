import express from "express";
import { initializeDatabaseConnection } from "../config/database.config";
import dotenv from "dotenv";
import cors from "cors";
import LoginRoute from "./routes/user/login.route";
import RegisterRoute from "./routes/user/register.route";
dotenv.config();

const server = express();

const startDatabaseConnection = async () => {
  await initializeDatabaseConnection();
};

startDatabaseConnection();

const port = process.env.SERVER_DEFAULT_PORT || 3000;

server.use(express.json());
server.use(cors());

server.use("/user/signin", LoginRoute);
server.use("/user/signup", RegisterRoute);

//Configure User routes
server.use("/user", LoginRoute);
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

server.get("/api/status", (req: express.Request, res: express.Response) => {
  return res.status(200).send({
    message: "Server is available on www.binjflix:3000.com",
    timestamp: new Date(),
  });
});
