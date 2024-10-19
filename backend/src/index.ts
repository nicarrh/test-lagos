import express, { Response, Express, Request } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import "dotenv/config";

import "./db";
import routes from "./routes";
import { intercepterCalls } from "./middlewares/cache";
const app: Express = express();

const PORT = "5000";

app.use(cors());
app.use((req, res, next) => {
  res.setTimeout(3600, () => {
    console.log("Request has timed out.");
    res.sendStatus(408);
  });
  next();
});
app.use(intercepterCalls);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api", routes);

app.listen(PORT, () => {
  console.log("Server is running on port 5000", `http://localhost:${PORT}`);
});
