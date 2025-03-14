import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./src/models/mongo/Product.js";
import { faker } from "@faker-js/faker";

dotenv.config(); // Load environment variables

const mongoURI = "mongodb+srv://mukuldata2000:musiclibrary@cluster0.wc804.mongodb.net/ecommerce_app_db";

const seedProducts = async () => {
  try {
    await mongoose.connect(mongoURI, 
    //     {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // }
);

    console.log("Connected to MongoDB");

    // Delete existing products (optional)
    await Product.deleteMany({});

    const products = [];

    for (let i = 1; i <= 20; i++) {
      products.push({
        name: `Mobile ${i}`,
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 100, max: 1000 })),
        category: faker.commerce.department(),
        stock: Math.floor(Math.random() * 100) + 1,
      });
    }

    await Product.insertMany(products);
    console.log("✅ Seeded 20 products successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Seeding error:", error);
    mongoose.connection.close();
  }
};

seedProducts();
