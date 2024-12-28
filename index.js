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
const PORT = process.env.PORT || 3000;

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

// Home Page
app.get("/", (req, res) => {
  res.render("index", {
    title: "Odysseus Insights",
    description: "Your Familly Travel Cost Calculator",
    path: req.path,
  });
});

// About Page
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

// Compass Routes
app.use("/voyage-compass", compassRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", {
    title: "Error",
    error: "Something went wrong!",
  });
});

app.listen(PORT, () => {
  console.log(`Icarus Insights is soaring on port ${PORT}`);
});

// For Vercel
export default app;
