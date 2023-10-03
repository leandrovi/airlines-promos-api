import express from "express";
import cors from "cors";
import { healthRouter, promotionsRouter } from "./routes";

export const app = express();
const port = process.env.PORT || 3333;

app.use(cors());
app.use("/health", healthRouter);
app.use("/promotions", promotionsRouter);

app.listen(port, () => {
  console.log(`🛫 Airlines promos API is running on port ${port}`);
});
