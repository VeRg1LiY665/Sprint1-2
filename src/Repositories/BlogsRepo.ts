import {db} from '../db/db'
import {BlogDBType} from "../Data Types/BlogDBType"
import {InputBlogType} from "../IO Types/InputBlogType";
import {PostDBType} from "../Data Types/PostDBType";

export const BlogsRepo = {
    async ShowAllBlogs () {
        const allblogs = await db.blogs
        return allblogs
    },
    async ShowBlogByID (id:string):Promise<BlogDBType> {
        const FoundBlog = await db.blogs.find((c: BlogDBType) => c.id === id)
        if (FoundBlog) {return FoundBlog}
        return
    },
    async DeleteBlog (id:string) {
        const flag = await db.blogs.find((c:BlogDBType)=>c.id=== id)
        if(!flag) {
            return false;
        }
        db.blogs= await db.blogs.filter((c: BlogDBType)  => c.id !== id)
        return true;
    },
    async SetUpNewBlog(content:InputBlogType) {
        const blog = {
            ...content,
            id: (Math.floor(Date.now() + Math.random())).toString(),
        }
        await db.blogs.push(blog)
        return blog
    },
    async ChangeBlog (id: string, content:InputBlogType) {
        const index = await db.blogs.findIndex((c: BlogDBType) => c.id === id)

        if (index < 0) {
            return false
        }
        else {
            const blog = {
                ...db.blogs[index],
                ...content,
            }
            await db.posts.forEach((c: PostDBType) => { if (c.blogName === db.blogs[index].name){c.blogName=content.name} })
            db.blogs[index] = await blog

            return true
        }
    }

}