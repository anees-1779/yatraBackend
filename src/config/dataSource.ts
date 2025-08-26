import { DataSource } from "typeorm";
import dotenv from "dotenv"
import { user } from "../model/userModel/userModel";
import { post } from "../model/postModel/postModel";
import { like } from "../model/postModel/likesModel";
import { comment } from "../model/postModel/commentsModel";
import { picture } from "../model/postModel/imageModel";


dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET

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
    entities: [user, post, like, comment, picture],
})      