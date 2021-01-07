"use strict";

import dotenv from "dotenv";
import { createServer as createServerHttps, Server as ServerHtpps } from "https";
import { createServer, Server } from "http";
if (process.env.NODE_ENV === "DEVELOPMENT") {
    dotenv.config();
}
import { app } from "./modules/app";
import { onListening } from "./modules/common/utils/server-utils";
import { generalConfig } from "./modules/config/general";
import fs from "fs";
const options = {
    key: fs.readFileSync("./example.com+5-key.pem"),
    cert: fs.readFileSync("./example.com+5.pem"),
    requestCert: false,
    rejectUnauthorized: false,
};

const port: number = generalConfig.env.PORT;

const server: Server | ServerHtpps = generalConfig.env.NODE_ENV === "DEVELOPMENT_HTTPS" ?
                            createServerHttps(options, app) : createServer(app);

server.listen(port);
server.on("listening", onListening(port));

process.on("unhandledRejection", (reason) => {
    throw reason;
});

process.on("uncaughtException", (err) => {
    console.error("There was an uncaught error", err);
    process.exit(1);
});
