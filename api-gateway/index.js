import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// Cargar documentación OpenAPI si existe
let apiDocs;
try {
  const openapiPath = path.join(__dirname, "openapi.yaml");
  apiDocs = YAML.load(openapiPath);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiDocs));
  console.log("✅ Swagger UI disponible en /api-docs");
} catch (err) {
  console.log("⚠️ No se encontró openapi.yaml, swagger-ui deshabilitado:", err.message);
}

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "API Gateway" });
});

// Proxy a FastAPI (Python backend)
app.use("/api/python", createProxyMiddleware({
  target: process.env.FASTAPI_URL || "http://fastapi:8000",
  changeOrigin: true,
  pathRewrite: { "^/api/python": "" }
}));

// Proxy a Node backend
app.use("/api/node", createProxyMiddleware({
  target: process.env.NODE_URL || "http://node:3001",
  changeOrigin: true,
  pathRewrite: { "^/api/node": "" }
}));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ API Gateway escuchando en puerto ${PORT}`);
});
