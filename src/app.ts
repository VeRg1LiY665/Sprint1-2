import express, {Request, Response} from 'express'
import cors from 'cors'
import {db} from "./db/db";
import {SETTINGS} from "./settings";
import {blogRouter} from "./Modules/Blogs/BlogsRouters";
import {postRouter} from "./Modules/Posts/PostsRouters";
import {
    BlogModel,
    CommentModel,
    DeviceModel,
    PostModel,
    ReqModel,
    UserModel
} from "./db/mongoDB";
import {authRouter} from "./Auth/AuthRouter";
import {usersRouter} from "./Modules/Users/UsersRouters";
import {ErrorHandler} from "./helpers/ErrorHandler";
import {commentsRouter} from "./Modules/Comments/CommentsRouters";
import cookieParser from "cookie-parser";
import {devicesRouter} from "./Security/DevicesRouter";

export const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.set('trust proxy', true) //для корректного парсинга ip

app.get('/', (req, res) => {
    res.status(200).json({version: '1.0'})
})

app.delete('/testing/all-data', async (req: Request, res: Response) => {
    await BlogModel.collection.drop();
    await PostModel.collection.drop();
    await UserModel.collection.drop();
    await CommentModel.collection.drop();
    await DeviceModel.collection.drop()
    await ReqModel.collection.drop();
    res.status(204).json('All data is deleted')
})

app.use(SETTINGS.PATH.BLOGS, blogRouter)
app.use(SETTINGS.PATH.POSTS, postRouter)
app.use(SETTINGS.PATH.USERS, usersRouter)
app.use(SETTINGS.PATH.AUTH, authRouter)
app.use(SETTINGS.PATH.COMMENTS, commentsRouter)
app.use(SETTINGS.PATH.DEVICES, devicesRouter)
app.use(ErrorHandler)