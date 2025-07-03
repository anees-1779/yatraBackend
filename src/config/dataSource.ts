import { DataSource } from "typeorm";
import dotenv from "dotenv"
import { user } from "../model/user";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_host,
    port: Number(process.env.DB_port),
    username: process.env.DB_username,
    password: process.env.DB_password,
    database: process.env.DB_name,
    synchronize: true,
    logging: false,
    subscribers: [],
    migrations: [],
    entities: [user],
})