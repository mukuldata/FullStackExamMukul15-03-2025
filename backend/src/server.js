import app from "./app.js";
import dotenv from "dotenv";
import { connectSQL } from "./config/sql.js";
import { connectMongo } from "./config/mongo.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to databases
connectSQL();
connectMongo();

// Start server
app.listen(PORT, () => {
    
  console.log(`Server running on port ${PORT}`);
});
