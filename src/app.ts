import express, {Request, Response} from 'express'
import cors from 'cors'
import {db} from "./db/db";
import {SETTINGS} from "./settings";
import {blogRouter} from "./Blogs/BlogsController";
import {postRouter} from "./Posts/PostsController";

export const app = express()
app.use(express.json())
app.use(cors())


app.get('/', (req, res) => {
    res.status(200).json({version: '1.0'})
})
app.delete('/testing/all-data', (req: Request, res: Response) => {
    db.blogs = [];
    db.posts = [];
    res.status(204).json('All data is deleted')
})
app.use(SETTINGS.PATH.BLOGS, blogRouter)
app.use(SETTINGS.PATH.POSTS, postRouter)