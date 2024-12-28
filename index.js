import "dotenv/config";
import express from "express";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import compassRoutes from "./routes/voyageCompassRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // Limit each IP to 100 request per 15 mins
});
app.use("/api/", limiter);

// View engine setup
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

// Routes
app.get("/", (req, res) => {
  res.render("index", {
    title: "Odysseus Insights",
    description: "Your Family Travel Cost Calculator",
    path: req.path,
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Us | Odysseus Insights",
    description: "Learn about our mission to simplify family travel planning",
    path: req.path,
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contact Us | Odysseus Insights",
    path: "/contact",
  });
});

app.use("/voyage-compass", compassRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", {
    title: "Error",
    error: "Something went wrong!",
  });
});

// Only start server if not running on Vercel
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
