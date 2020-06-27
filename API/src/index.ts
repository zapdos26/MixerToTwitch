import { createConnection } from "typeorm";
import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes";
import { schedule } from "node-cron";
import { ServiceProcessor } from "./services/ServiceProcessor";

require("dotenv").config();

// Connects to the Database -> then starts the express
createConnection()
  .then(async (connection) => {
    // Create a new express application instance
    const app = express();

    // Call middlewares
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());

    // Set all routes from routes folder
    app.use("/", routes);

    app.listen(3000, () => {
      console.log("Server started on port 3000!");
    });
    ServiceProcessor.processAll().then();
    schedule("0 1 * * *", () => {
      ServiceProcessor.processAll().then();
    });
  })
  .catch((error) => console.log(error));
