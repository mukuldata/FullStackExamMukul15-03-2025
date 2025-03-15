import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/mongo/Product.js";
import { faker } from "@faker-js/faker";

dotenv.config(); 

const mongoURI =process.env.MONGO_URI

const seedProducts = async () => {
  try {
    await mongoose.connect(mongoURI, {}
);

    console.log("Connected to MongoDB");

    await Product.deleteMany({});

    const products = [];

    const categories = ["Electronics", "Clothing", "Kitchen", "Sports"];

    for (let i = 1; i <= 30; i++) {
      products.push({
        name: `Product ${i}`,
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 100, max: 1000 })),
        category: categories[Math.floor(Math.random() * categories.length)], 
        stock: Math.floor(Math.random() * 100) + 1,
      });
    }

    await Product.insertMany(products);
    console.log("Seeded 20 products successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Seeding error:", error);
    mongoose.connection.close();
  }
};

seedProducts();
