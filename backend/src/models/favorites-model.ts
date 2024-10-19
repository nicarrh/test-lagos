import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  cancion_id: String,
  ranking: String,
  nombre_tema: String,
  userId: String,
});

export default mongoose.model("Favorite", favoriteSchema);
