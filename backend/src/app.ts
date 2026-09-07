import express from "express";
import cors from "cors";
import itemRoutes from "./routes/itemRoutes";
import neighborhoodRoutes from "./routes/neighborhoodRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "JiranAid API is running",
  });
});

app.use("/api/items", itemRoutes);

app.use("/api/neighborhoods", neighborhoodRoutes);

export default app;