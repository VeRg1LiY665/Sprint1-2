import {db} from '../db/db'
import {PostDBType} from "../Data Types/PostDBType";
import {InputPostType} from "../IO Types/InputPostType";
import {BlogsRepo} from "./BlogsRepo";

export const PostRepo = {
    async ShowAllPosts () {
        return await db.posts
    },
    async ShowPostByID (id:string) {
        const FoundBlog = await db.posts.find((c: PostDBType) => c.id === id)
        return FoundBlog
    },
    async DeletePost (id:string) {
        const flag = await db.posts.find((c:PostDBType)=>c.id=== id)
        if(!flag) {
            return false;
        }
        db.posts= await db.posts.filter((c: PostDBType)  => c.id !== id)
        return true;
    },
    async SetUpNewPost(content:InputPostType) {

        const post = {
            ...content,
            id: (Math.floor(Date.now() + Math.random())).toString(),
            blogName: await BlogsRepo.ShowBlogByID(content.blogId)!.name
        }

        await db.posts.push(post)
        return post
    },
    async ChangePost (id: string, content:InputPostType) {
        const index = await db.posts.findIndex((c: PostDBType) => c.id === id)

        if (index < 0) {
            return false
        }
        else {
            const post = {
                ...db.posts[index],

                ...content,
            }
            if (content.blogId !== db.posts[index].blogId) {
                post.blogName =  BlogsRepo.ShowBlogByID(content.blogId)!.name
            }
            db.posts[index] = post
            return true
        }
    }
}