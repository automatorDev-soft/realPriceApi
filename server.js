import express from "express";
import bodyParser from "body-parser";
import router from "./routes/api.js";

const app = express(); // Create a new express app instance

app.use(bodyParser.json()); // Add body-parser middleware
app.use("/api", router); // Mount the API router

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
