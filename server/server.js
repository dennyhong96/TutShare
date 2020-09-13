require("dotenv").config({ path: "./config/config.env" });
const express = require("express");
const connectDB = require("./config/db");

// Routers
const authRouter = require("./routes/auth");

connectDB();
const app = express();

app.use("/api/v1/auth", authRouter);

const port = process.env.NODE_ENV || 5000;
app.listen(port, () => console.log(`Server up on port ${port}...`));
