import mongoose from "mongoose";


const MONGO_URI = process.env.MONGO_URI;

const connectMongo = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log( `MongoDB connected ${MONGO_URI}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export { connectMongo };
