import { Request, Response, Router } from "express";
import FavoritesModel from "../models/favorites-model";
import { Error } from "mongoose";
import { memoryCache } from "../middlewares/cache";
import { randomUUID } from "crypto";

const router = Router();

type Song = {
  artistId: string;
  collectionName: string;
  trackId: string;
  trackName: string;
  artistName: string;
  previewUrl: string;
};
router.get("/search_tracks", async (req: Request, res: Response) => {
  const name = req.query.name as string;
  try {
    const json = await fetch(
      `${process.env.PUBLIC_API_ITUNES}/search?term=${name}`
    )
      .then((response) => response.json())
      .catch((error) => {
        throw error;
      });
    const { results } = json;
    const data = results.filter(
      (item: any) => item?.artistName.toLowerCase() === name?.toLowerCase()
    );
    let tracks: any[] = [];
    let albums: Object = {};
    // get albums grouped
    data.reduce((acc: any, item: any) => {
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

    data.reduce((acc: any, item: any) => {
      if (
        !acc.find(
          (d: any) =>
            d.cancion_id === item.trackId || d.nombre_tema === item.trackName
        )
      ) {
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

    let existingUserId = await memoryCache.get("userId");
    if (!existingUserId) {
      existingUserId = randomUUID();
      await memoryCache.set("userId", existingUserId);
    }
    const favorites = await FavoritesModel.find({ userId: existingUserId });
    await memoryCache.set(
      req.originalUrl,
      JSON.stringify({
        ok: true,
        favorites,
        total_albumes: Object.keys(albums).length,
        total_canciones: tracks.length,
        albumes: Object.values(albums).map((val) => val.collectionName),
        canciones: tracks.slice(0, 24),
      })
    );

    res.send({
      ok: true,
      favorites,
      total_albumes: Object.keys(albums).length,
      total_canciones: tracks.length,
      albumes: Object.values(albums).map((val) => val.collectionName),
      canciones: tracks.slice(0, 24),
    });
  } catch (err) {
    res.send({ ok: false, data: [], error: err });
  }
});

router.post("/favorite", async (req: Request, res: Response) => {
  const { nombre_tema, cancion_id, ranking } = req.body;
  const userId = await memoryCache.get("userId");
  const favoriteSong = new FavoritesModel({
    nombre_tema,
    cancion_id,
    ranking,
    userId,
  });

  try {
    const fav = await favoriteSong.save();
    res.status(200).json({
      message: `Canción ${nombre_tema} agregada a tu lista de favoritos`,
      favorite: fav,
    });
  } catch (err) {
    res.status(500).json({
      message: "Hubo un error al agregar la canción a tu lista de favoritos",
      error: err,
    });
  }
});

router.get("/favorites", async (req, res) => {
  const userId = await memoryCache.get("userId");
  try {
    const favorites = await FavoritesModel.find({ userId });
    res.status(200).json({
      message: "Tus canciones favoritas",
      favorites,
    });
  } catch (e) {
    res.status(500).json({
      message: "Hubo un error al obtener tus canciones favoritas",
      error: e,
    });
  }
});

export default router;
