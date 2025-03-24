import express, {Request, Response} from 'express'
import cors from 'cors'
import {db} from "./db/db";
import {SETTINGS} from "./settings";
import {blogRouter} from "./Modules/Blogs/BlogsRouters";
import {postRouter} from "./Modules/Posts/PostsRouters";
import {blogsCollection, commentsCollection, postsCollection, usersCollection} from "./db/mongoDB";
import {authRouter} from "./Auth/AuthRouter";
import {usersRouter} from "./Modules/Users/UsersRouters";
import {ErrorHandler} from "./helpers/ErrorHandler";
import {commentsRouter} from "./Modules/Comments/CommentsRouters";
import cookieParser from "cookie-parser";

export const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())


app.get('/', (req, res) => {
    res.status(200).json({version: '1.0'})
})

app.delete('/testing/all-data', async (req: Request, res: Response) => {
    await postsCollection.drop();
    await blogsCollection.drop();
    await usersCollection.drop();
    await commentsCollection.drop();
    res.status(204).json('All data is deleted')
})

app.use(SETTINGS.PATH.BLOGS, blogRouter)
app.use(SETTINGS.PATH.POSTS, postRouter)
app.use(SETTINGS.PATH.USERS, usersRouter)
app.use(SETTINGS.PATH.AUTH, authRouter)
app.use(SETTINGS.PATH.COMMENTS, commentsRouter)
app.use(ErrorHandler)