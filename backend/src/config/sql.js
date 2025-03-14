import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.SQL_DB,
  process.env.SQL_USER,
  process.env.SQL_PASSWORD,
  {
    host: process.env.SQL_HOST,
    dialect: "postgres", 
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, 
      },
    }
  }
);

const connectSQL = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log( `SQL database connected ${process.env.SQL_DB}`);
  } catch (error) {
    console.error("SQL connection error:", error);
  }
};

export { sequelize, connectSQL };
