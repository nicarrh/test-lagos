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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const favorites_model_1 = __importDefault(require("../models/favorites-model"));
const cache_1 = require("../middlewares/cache");
const crypto_1 = require("crypto");
const router = (0, express_1.Router)();
router.get("/search_tracks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.query.name;
    try {
        const json = yield fetch(`${process.env.PUBLIC_API_ITUNES}/search?term=${name}`)
            .then((response) => response.json())
            .catch((error) => {
            throw error;
        });
        const { results } = json;
        const data = results.filter((item) => (item === null || item === void 0 ? void 0 : item.artistName.toLowerCase()) === (name === null || name === void 0 ? void 0 : name.toLowerCase()));
        let tracks = [];
        let albums = {};
        // get albums grouped
        data.reduce((acc, item) => {
            if (!acc[item.collectionId]) {
                acc[item.collectionId] = {
                    collectionId: item.collectionId,
                    collectionName: item.collectionName,
                    artistName: item.artistName,
                    // songs: [],
                };
            }
            return acc;
        }, albums);
        data.reduce((acc, item) => {
            if (!acc.find((d) => d.cancion_id === item.trackId || d.nombre_tema === item.trackName)) {
                acc.push({
                    nombre_tema: item.trackName,
                    cancion_id: item.trackId,
                    nombre_album: item.collectionName,
                    preview_url: item.previewUrl,
                    fecha_lanzamiento: item.releaseDate,
                    precio: {
                        valor: item.trackPrice,
                        moneda: item.currency,
                    },
                });
            }
            // acc[item.trackid]
            return acc;
        }, tracks);
        let existingUserId = yield cache_1.memoryCache.get("userId");
        if (!existingUserId) {
            existingUserId = (0, crypto_1.randomUUID)();
            yield cache_1.memoryCache.set("userId", existingUserId);
        }
        const favorites = yield favorites_model_1.default.find({ userId: existingUserId });
        yield cache_1.memoryCache.set(req.originalUrl, JSON.stringify({
            ok: true,
            favorites,
            total_albumes: Object.keys(albums).length,
            total_canciones: tracks.length,
            albumes: Object.values(albums).map((val) => val.collectionName),
            canciones: tracks.slice(0, 24),
        }));
        res.send({
            ok: true,
            favorites,
            total_albumes: Object.keys(albums).length,
            total_canciones: tracks.length,
            albumes: Object.values(albums).map((val) => val.collectionName),
            canciones: tracks.slice(0, 24),
        });
    }
    catch (err) {
        res.send({ ok: false, data: [], error: err });
    }
}));
router.post("/favorite", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre_tema, cancion_id, ranking } = req.body;
    const userId = yield cache_1.memoryCache.get("userId");
    const favoriteSong = new favorites_model_1.default({
        nombre_tema,
        cancion_id,
        ranking,
        userId,
    });
    try {
        const fav = yield favoriteSong.save();
        res.status(200).json({
            message: `Canción ${nombre_tema} agregada a tu lista de favoritos`,
            favorite: fav,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Hubo un error al agregar la canción a tu lista de favoritos",
            error: err,
        });
    }
}));
router.get("/favorites", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = yield cache_1.memoryCache.get("userId");
    try {
        const favorites = yield favorites_model_1.default.find({ userId });
        res.status(200).json({
            message: "Tus canciones favoritas",
            favorites,
        });
    }
    catch (e) {
        res.status(500).json({
            message: "Hubo un error al obtener tus canciones favoritas",
            error: e,
        });
    }
}));
exports.default = router;
