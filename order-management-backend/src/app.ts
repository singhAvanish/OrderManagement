import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import orderRoutes from "./routes/orderRoutes";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";

dotenv.config();

const app = express();




app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true, 
}));

app.use(express.json({ limit: "5mb" })); 
app.use(express.urlencoded({ extended: true }));


app.use("/api/orders", orderRoutes);  
app.use("/api/admin", authRoutes);    
app.use((req, res, next) => {
    console.log("➡️ Incoming request:", req.method, req.url);
    next();
  });
  


app.use(errorHandler);

export default app;
