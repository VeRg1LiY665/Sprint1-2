import {config} from 'dotenv'
config() // добавление переменных из файла .env в process.env

export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts'
    },
    PASS: process.env.PASSWORD,
    LOGIN: process.env.LOGIN,
    DB_NAME: process.env.DB_NAME || 'test',
    MONGO_URL: process.env.MONGO_URL as string,
}