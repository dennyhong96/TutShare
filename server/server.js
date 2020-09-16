require("dotenv").config({ path: "./config/config.env" });
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

// Routers
const authRouter = require("./routes/auth");

connectDB();
const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth", authRouter);

const port = process.env.NODE_ENV || 5000;
app.listen(port, () => console.log(`Server up on port ${port}...`));
