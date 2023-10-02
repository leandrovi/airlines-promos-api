import { healthCheck } from "@/controllers/health";
import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", healthCheck);
