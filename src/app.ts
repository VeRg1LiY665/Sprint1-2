import express, {Request, Response} from 'express'
import cors from 'cors'
import {db} from "./db/db";
import {SETTINGS} from "./settings";
import {blogRouter} from "./Blogs/BlogsRouters";
import {postRouter} from "./Posts/PostsRouters";
import {blogsCollection, postsCollection} from "./db/mongoDB";

export const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).json({version: '1.0'})
})
app.delete('/testing/all-data', async (req: Request, res: Response) => {
    await postsCollection.drop();
    await blogsCollection.drop();
    res.status(204).json('All data is deleted')
})

app.use(SETTINGS.PATH.BLOGS, blogRouter)
app.use(SETTINGS.PATH.POSTS, postRouter)