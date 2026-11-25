require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env")
});

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const { sequelize } = require("./models");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const businessRoutes = require("./routes/business.routes");
const workshopRoutes = require("./routes/workshop.routes");
const { seed } = require("./seed");
const { runSafeMigrations } = require("./config/migrations");
const { startSubscriptionJob } = require("./jobs/subscription.job");

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

const cspOrigins = String(
  process.env.CSP_CONNECT_ORIGINS ||
  "http://localhost:4000,http://127.0.0.1:4000"
).split(",").map(x => x.trim()).filter(Boolean);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      connectSrc: ["'self'", ...cspOrigins]
    }
  }
}));

const allowedOrigins = String(
  process.env.CLIENT_ORIGIN || "http://localhost:5173"
).split(",").map(x => x.trim()).filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));

app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false
  }),
  authRoutes
);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ZAR ERP",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/super-admin", adminRoutes);
app.use("/api", businessRoutes);
app.use("/api", workshopRoutes);

app.use((req, res) =>
  res.status(404).json({
    message: "API endpoint topilmadi",
    path: req.originalUrl
  })
);

app.use((error, req, res, next) => {
  console.error(error);

  if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      message: "Bu qiymat allaqachon mavjud"
    });
  }

  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({
      message: error.errors?.[0]?.message || "Ma’lumotlar noto‘g‘ri"
    });
  }

  return res.status(error.status || 500).json({
    message: error.status
      ? error.message
      : process.env.NODE_ENV === "production"
        ? "Server xatoligi"
        : error.message || "Server xatoligi"
  });
});

(async () => {
  try {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      throw new Error("JWT_SECRET kamida 32 belgidan iborat bo‘lishi kerak");
    }

    await sequelize.authenticate();
    await sequelize.sync();
    await runSafeMigrations();
    await seed();

    startSubscriptionJob();

    const port = Number(process.env.PORT || 4000);
    app.listen(port, "0.0.0.0", () => {
      console.log(`ZAR ERP API :${port}`);
    });
  } catch (error) {
    console.error("ZAR ERP startup failed:", error);
    process.exit(1);
  }
})();
