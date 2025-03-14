import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reportsRoutes from "./routes/reportRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const app = express();

app.use(
  cors({
    origin:[process.env.CLIENT_URL,"http://localhost:3000"],
    credentials: true, 
    methods: "GET,POST,PUT,DELETE",
  })
);


app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/reports", reportsRoutes);


app.use(errorMiddleware);

export default app;
