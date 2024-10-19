"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
require("./db");
const routes_1 = __importDefault(require("./routes"));
const cache_1 = require("./middlewares/cache");
const app = (0, express_1.default)();
const PORT = "5000";
app.use((0, cors_1.default)());
app.use((req, res, next) => {
    res.setTimeout(3600, () => {
        console.log("Request has timed out.");
        res.sendStatus(408);
    });
    next();
});
app.use(cache_1.intercepterCalls);
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use("/api", routes_1.default);
app.listen(PORT, () => {
    console.log("Server is running on port 5000", `http://localhost:${PORT}`);
});
