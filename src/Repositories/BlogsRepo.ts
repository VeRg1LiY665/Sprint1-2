import {db} from '../db/db'
import {BlogDBType} from "../Data Types/BlogDBType"
import {InputBlogType} from "../IO Types/InputBlogType";
import {PostDBType} from "../Data Types/PostDBType";

export const BlogsRepo = {
    ShowAllBlogs () {
        return db.blogs
    },
    ShowBlogByID (id:string) {
        const FoundBlog = db.blogs.find((c: BlogDBType) => c.id === id)
    return FoundBlog
    },
    DeleteBlog (id:string) {
        const flag = db.blogs.find((c:BlogDBType)=>c.id=== id)
        if(!flag) {
            return false;
        }
        db.blogs= db.blogs.filter((c: BlogDBType)  => c.id !== id)
        return true;
    },
    SetUpNewBlog(content:InputBlogType) {
        const blog = {
            ...content,
            id: (Math.floor(Date.now() + Math.random())).toString(),
        }
        db.blogs.push(blog)
        return blog
    },
    ChangeBlog (id: string, content:InputBlogType) {
        const index = db.blogs.findIndex((c: BlogDBType) => c.id === id)

        if (index < 0) {
            return false
        }
        else {
            const blog = {
                ...db.blogs[index],
                ...content,
            }
            db.posts.forEach((c: PostDBType) => { if (c.blogName === db.blogs[index].name){c.blogName=content.name} })
            db.blogs[index] = blog

            return true
        }
    }

}