"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@api-songs.edj72.mongodb.net/?retryWrites=true&w=majority&appName=api-songs`;
mongoose_1.default
    .connect(uri)
    .then(() => {
    console.log("Connected to MongoDB!");
})
    .catch((error) => console.error("Error al conectar a MongoDB", error));
