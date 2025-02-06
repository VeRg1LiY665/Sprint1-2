import {db} from '../db/db'
import {PostDBType} from "../Data Types/PostDBType";
import {InputPostType} from "../IO Types/InputPostType";
import {BlogsRepo} from "./BlogsRepo";

export const PostRepo = {
    ShowAllPosts () {
        return db.posts
    },
    ShowPostByID (id:string) {
        const FoundBlog = db.posts.find((c: PostDBType) => c.id === id)
        return FoundBlog
    },
    DeletePost (id:string) {
        const flag = db.posts.find((c:PostDBType)=>c.id=== id)
        if(!flag) {
            return false;
        }
        db.posts= db.posts.filter((c: PostDBType)  => c.id !== id)
        return true;
    },
    SetUpNewPost(content:InputPostType): PostDBType {

        const post = {
            ...content,
            id: (Math.floor(Date.now() + Math.random())).toString(),
            blogName: BlogsRepo.ShowBlogByID(content.blogId).name
        }
        db.posts.push(post)
        return post
    },
    ChangePost (id: string, content:InputPostType) {
        const index = db.posts.findIndex((c: PostDBType) => c.id === id)

        if (index < 0) {
            return false
        }
        else {
            const blog = {
                ...db.posts[index],

                ...content,
            }
            if (content.blogId !== db.posts[index].id) {
                blog.blogName =  BlogsRepo.ShowBlogByID(content.blogId).name
            }
            db.posts[index] = blog
            return true
        }
    }
}