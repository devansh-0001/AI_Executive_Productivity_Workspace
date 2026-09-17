import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import dashboardRoutes from "./routes/dashboard.routes.js";
import commitmentRoutes from "./routes/commitment.routes.js";
import emailRoutes from "./routes/email.routes.js";
import calendarRoutes from "./routes/calendar.routes.js";
import peopleRoutes from "./routes/people.routes.js";
import aiRoutes from "./routes/chat.routes.js";
import sourcesRoutes from "./routes/sources.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import searchRoutes from "./routes/search.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

// API Routes
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/commitments", commitmentRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/people", peopleRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/sources", sourcesRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notifications", notificationRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "LeadDesk API", time: new Date().toISOString() });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled API Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error"
  });
});

export default app;
