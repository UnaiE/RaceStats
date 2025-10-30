import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import apiDocs from "./openapi.json" assert { type: "json" };

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiDocs));

app.get("/health", (req, res) => res.json({ status: "ok" }));

export default app;
