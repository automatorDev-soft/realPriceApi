import express from "express";
import bodyParser from "body-parser";
import router from "./routes/api.js";
import cors from "cors";

const app = express(); // Create a new express app instance
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Enable cookies
  optionsSuccessStatus: 204,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Origin",
    "X-Requested-With",
    "application/json",
  ],
};

app.use(cors(corsOptions)); // Enable CORS with specified options

app.use(bodyParser.json()); // Add body-parser middleware
app.use("/api", router); // Mount the API router
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
