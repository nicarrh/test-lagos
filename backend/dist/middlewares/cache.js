"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.intercepterCalls = exports.memoryCache = void 0;
const cache_manager_1 = require("cache-manager");
exports.memoryCache = (0, cache_manager_1.createCache)({ ttl: 60 * 60 * 1000 * 24 });
const intercepterCalls = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("request", req.originalUrl);
    const data = yield exports.memoryCache.get(req.originalUrl);
    let parsed = JSON.parse(data);
    console.log("data cached", JSON.parse(data));
    if (data) {
        console.log("Cache hit", req.originalUrl);
        res.json(parsed);
        return;
    }
    next();
});
exports.intercepterCalls = intercepterCalls;
