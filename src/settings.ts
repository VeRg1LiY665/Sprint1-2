import {config} from 'dotenv'
config() // добавление переменных из файла .env в process.env

export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        USERS: '/users',
        AUTH: '/auth',
        COMMENTS: '/comments',
        DEVICES: '/security/devices',
        REQUESTS: '/requests',
    },
    PASS: process.env.PASSWORD,
    LOGIN: process.env.LOGIN,
    DB_NAME: process.env.DB_NAME || 'test',
    MONGO_URL: process.env.MONGO_URL as string,
    AC_SECRET: process.env.AC_SECRET as string,
    AC_TIME: process.env.AC_TIME as string,
    R_SECRET: process.env.R_SECRET as string,
    R_TIME: process.env.R_TIME as string,
    EMAIL: process.env.EMAIL as string,
    EMAIL_PASS: process.env.EMAIL_PASS as string,
}